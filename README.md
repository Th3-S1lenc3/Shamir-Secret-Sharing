# Shamir-Secret-Sharing

App for creating and combining secrets with Shamir Secret Sharing.
Created with Node.js, Electron & React.

If you experience a problem, search through the [Issues](https://github.com/Th3-S1lenc3/Shamir-Secret-Sharing/issues) to see if yours has already been reported. If you're confident it hasn't been reported yet, feel free to open up a new one. If you see your issue and it's been closed, it probably means that the fix for it will ship in the next version, and you'll have to wait a bit.

*( Jump to: [Technologies](#technologies) - [Installation & Usage](#installation--usage) - [License](#license) )*

# Technologies
[Back to top](#shamir-secret-sharing)

Project is created with:

  - @consento/shamirs-secret-sharing: 1.0.4
  - @fortawesome/fontawesome-svg-core: 1.2.35
  - @fortawesome/free-solid-svg-icons: 5.15.3
  - @fortawesome/react-fontawesome: 0.1.14
  - bootstrap: 4.6.0
  - jquery: 3.5.1
  - react: 17.0.2

# Installation & Usage
[Back to top](#shamir-secret-sharing)

### Option 1: Download a prebuilt binary

Go to the [Releases](https://github.com/Th3-S1lenc3/Shamir-Secret-Sharing/releases) page and download the release for your operating system.

On Linux, you will need to `chmod +x` the AppImage file in order to run it.

#### Optional:
Verify your download by generating a SHA256 sum of the downloaded file and then check that matches the sum for your file on the releases page.

On *nix systems:
```
$ sha256sum <path_to_downloaded_file>
```
Example:
```
$ sha256sum shamir-secret-sharing_1.0.0_amd64_linux.AppImage
```

On Windows:
```
Powershell
$ Get-FileHash -Path <path_to_downloaded_file>

Command Prompt
$ certutil -hashfile <path_to_downloaded_file> sha256
```
Example:
```
Powershell
$ Get-FileHash -Path shamir-secret-sharing_1.0.0_amd64_windows_portable.exe

Command Prompt
$ certutil -hashfile shamir-secret-sharing_1.0.0_amd64_windows_portable.exe sha256
```

### Option 2 : Clone from repository
**IMPORTANT NOTE:** downloading the latest release will download the latest unreleased, development version and may not be stable.

Download Latest:
```
$ git clone https://github.com/Th3-S1lenc3/Shamir-Secret-Sharing.git
$ cd Shamir-Secret-Sharing
$ npm install
$ npm run electron-dev
```
Download from tag:
```
$ git clone --depth 1 --branch <tag_name> https://github.com/Th3-S1lenc3/Shamir-Secret-Sharing.git
$ cd Shamir-Secret-Sharing
$ npm install
$ npm run electron-dev
```

# License
[Back to top](#shamir-secret-sharing)

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details
