const STORAGE_KEY = 'landRecords';
const landForm = document.getElementById('landForm');
const landTableBody = document.querySelector('#landTable tbody');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sortRecords');
const recordDialog = document.getElementById('recordDialog');
const toast = document.getElementById('toast');

function loadRecords() {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (!savedRecords) return [];

    let parsedRecords;
    try {
        parsedRecords = JSON.parse(savedRecords);
    } catch (error) {
        alert('Saved land records could not be read. The data in this browser has not been changed.');
        throw error;
    }

    if (!Array.isArray(parsedRecords)) {
        throw new Error('Saved land records must be a list.');
    }

    return parsedRecords.map((record, index) => ({
        id: record.id || `record-${index}-${Date.now()}`,
        owner: String(record.owner || ''),
        landId: String(record.landId || ''),
        area: Number(record.area) || 0,
        location: String(record.location || '')
    }));
}

let landRecords = loadRecords();
let editingId = null;
let toastTimer;

function saveRecords() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(landRecords));
        return true;
    } catch (error) {
        alert('Could not save your records in this browser. Check available storage and try again.');
        return false;
    }
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
}

function formatArea(area) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(area);
}

function getVisibleRecords() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const records = landRecords.filter(record =>
        [record.owner, record.landId, record.location].some(value =>
            value.toLocaleLowerCase().includes(query)
        )
    );
    const sortBy = sortSelect.value;

    return records.sort((first, second) => {
        if (sortBy === 'area-desc') return second.area - first.area;
        if (sortBy === 'area-asc') return first.area - second.area;
        return first[sortBy].localeCompare(second[sortBy], undefined, { sensitivity: 'base' });
    });
}

function createActionButton(label, className, record, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.setAttribute('aria-label', `${label} ${record.landId}`);
    button.addEventListener('click', () => handler(record.id));
    return button;
}

function renderTable() {
    const visibleRecords = getVisibleRecords();
    landTableBody.replaceChildren();

    visibleRecords.forEach(record => {
        const row = document.createElement('tr');
        const ownerCell = row.insertCell();
        ownerCell.className = 'owner-cell';
        ownerCell.textContent = record.owner;
        row.insertCell().textContent = record.landId;
        row.insertCell().textContent = `${formatArea(record.area)} sq ft`;
        row.insertCell().textContent = record.location;

        const actionsCell = row.insertCell();
        actionsCell.className = 'actions-cell';
        actionsCell.append(
            createActionButton('Edit', 'text-action', record, openEditDialog),
            createActionButton('Delete', 'text-action text-danger', record, deleteRecord)
        );
        landTableBody.appendChild(row);
    });

    const uniqueLocations = new Set(
        landRecords.map(record => record.location.trim().toLocaleLowerCase()).filter(Boolean)
    );
    document.getElementById('recordCount').textContent = landRecords.length;
    document.getElementById('totalArea').firstChild.textContent =
        `${formatArea(landRecords.reduce((sum, record) => sum + record.area, 0))} `;
    document.getElementById('locationCount').textContent = uniqueLocations.size;

    const emptyState = document.getElementById('emptyState');
    const isFiltered = searchInput.value.trim().length > 0;
    emptyState.hidden = visibleRecords.length > 0;
    document.getElementById('emptyTitle').textContent = isFiltered ? 'No matching records' : 'No land records yet';
    document.getElementById('emptyMessage').textContent = isFiltered
        ? 'Try another owner, land ID, or location.'
        : 'Add your first property to get started.';
    document.getElementById('emptyAddButton').hidden = isFiltered;
    document.getElementById('tableFooter').textContent = `${visibleRecords.length} of ${landRecords.length} ${landRecords.length === 1 ? 'record' : 'records'}`;
}

function openAddDialog() {
    editingId = null;
    landForm.reset();
    document.getElementById('dialogTitle').textContent = 'Add a land record';
    document.getElementById('saveButton').textContent = 'Save record';
    recordDialog.showModal();
    document.getElementById('owner').focus();
}

function openEditDialog(id) {
    const record = landRecords.find(item => item.id === id);
    if (!record) return;

    editingId = id;
    document.getElementById('dialogTitle').textContent = 'Edit land record';
    document.getElementById('saveButton').textContent = 'Save changes';
    document.getElementById('owner').value = record.owner;
    document.getElementById('landId').value = record.landId;
    document.getElementById('area').value = record.area;
    document.getElementById('location').value = record.location;
    recordDialog.showModal();
    document.getElementById('owner').focus();
}

function deleteRecord(id) {
    const record = landRecords.find(item => item.id === id);
    if (!record || !window.confirm(`Delete the record for ${record.landId}? This cannot be undone.`)) return;

    const previousRecords = landRecords;
    landRecords = landRecords.filter(item => item.id !== id);
    if (!saveRecords()) {
        landRecords = previousRecords;
        return;
    }
    renderTable();
    showToast('Record deleted.');
}

function exportCsv() {
    if (landRecords.length === 0) {
        showToast('Add a record before exporting.');
        return;
    }

    const fields = ['owner', 'landId', 'area', 'location'];
    const rows = [
        ['Owner name', 'Land ID', 'Area (sq ft)', 'Location'],
        ...landRecords.map(record => fields.map(field => record[field]))
    ];
    const csv = rows.map(row => row.map(value => {
        const safeValue = String(value).replace(/"/g, '""');
        return `"${safeValue}"`;
    }).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'land-records.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('CSV export downloaded.');
}

landForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!landForm.reportValidity()) return;

    const record = {
        id: editingId || `record-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        owner: document.getElementById('owner').value.trim(),
        landId: document.getElementById('landId').value.trim(),
        area: Number(document.getElementById('area').value),
        location: document.getElementById('location').value.trim()
    };

    const previousRecords = landRecords;
    if (editingId) {
        landRecords = landRecords.map(item => item.id === editingId ? record : item);
    } else {
        landRecords = [...landRecords, record];
    }

    if (!saveRecords()) {
        landRecords = previousRecords;
        return;
    }

    recordDialog.close();
    landForm.reset();
    renderTable();
    showToast(editingId ? 'Changes saved.' : 'Land record added.');
});

document.getElementById('addRecordButton').addEventListener('click', openAddDialog);
document.getElementById('emptyAddButton').addEventListener('click', openAddDialog);
document.getElementById('closeDialogButton').addEventListener('click', () => recordDialog.close());
document.getElementById('cancelButton').addEventListener('click', () => recordDialog.close());
document.getElementById('exportButton').addEventListener('click', exportCsv);
searchInput.addEventListener('input', renderTable);
sortSelect.addEventListener('change', renderTable);

renderTable();
