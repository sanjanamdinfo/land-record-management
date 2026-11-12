# Land Registry

A simple browser-based land record management app for tracking property information, ownership details, land area, and location data in one place.

## Overview

This project provides a clean interface to manage land records without a backend or login system. It is designed for quick local use, especially for demos, student projects, and personal record keeping.

The application stores data in the browser using `localStorage`, so records remain available on the same device until cleared.

## Features

- Add new land records with owner name, land ID, area, and location
- Edit existing records
- Delete records with confirmation
- Search records by owner, land ID, or location
- Sort records by owner, land ID, area, or location
- View quick summary statistics:
  - total number of records
  - total land area
  - number of unique locations
- Export records to CSV for backup or reporting
- Responsive layout for desktop and mobile screens

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Browser localStorage for persistence

## Screenshots

### Home screen

![Home page](assets/screenshots/homepage.png)

### Add record form

![Add record form](assets/screenshots/add-record.png)

### Record list

![Land records list](assets/screenshots/records.png)

### Search and filter

![Search records](assets/screenshots/search.png)

## Project Structure

```text
land-record-management/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
├── assets/
│   └── screenshots/
│       ├── homepage.png
│       ├── add-record.png
│       ├── records.png
│       └── search.png
└── .vscode/
```

## How to Run

### Option 1: Open directly

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in any browser.

### Option 2: Run a local server

From the project folder in PowerShell:

```powershell
py -m http.server 8081
```

Then visit:

```text
http://localhost:8081
```

Press `Ctrl + C` to stop the server.

## Data and Privacy

- Records are stored only in the browser's local storage.
- Data is not synced across devices or uploaded to a server.
- Use the CSV export feature to keep a backup.
- This is a front-end demo and should not be used for official legal or sensitive land document storage.

## Developer

Sanjana M D

## License

This project is intended for educational and learning purposes. No formal license file is included.
