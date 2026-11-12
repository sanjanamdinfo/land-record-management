# Land Registry

A lightweight, responsive land-record manager built with HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

## Features

- Add, edit, and delete land records
- Search by owner, land ID, or location
- Sort records by owner, ID, area, or location
- View total records, combined land area, and unique locations
- Export records as a CSV spreadsheet
- Save records in this browser using `localStorage`
- Use the interface on desktop or mobile

## Run the project

Project folder:

```text
C:\Users\AdminX\OneDrive\Desktop\land record
```

**Quick start:** Open that folder in File Explorer and double-click `index.html`.

**VS Code:** Open the project folder, then open `index.html` in a browser. Alternatively, if you have the Live Server extension, right-click `index.html` and choose **Open with Live Server**.

**Optional local web server (Windows):** Open PowerShell in the project folder and run:

```powershell
py -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080). Press `Ctrl+C` in PowerShell to stop the server.

## Data and privacy

Records are stored in the browser's local storage on the device where you enter them. They are not sent to a server and do not automatically sync between browsers or devices. Use **Export CSV** to keep a separate copy. This demo is not a secure legal-record storage system; avoid entering sensitive personal information.

## Publish to GitHub

1. Create a new, empty repository on [GitHub](https://github.com/new). Do not initialize it with a README, license, or `.gitignore` because this folder already contains project files.
2. Open PowerShell in the project folder and run the following commands. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details:

```powershell
git init
git add .
git commit -m "Add Land Registry project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Git may ask you to authenticate with GitHub. Do not put passwords or access tokens in project files.

To publish the static site with GitHub Pages, open the repository's **Settings → Pages**, choose the `main` branch and `/ (root)` folder as the source, and save. GitHub will show the published website address on that page.
