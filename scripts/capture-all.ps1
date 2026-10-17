param(
    [string]$BaseUrl = "http://localhost:4173"
)

Add-Type -AssemblyName System.Drawing

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$artifactDir = "C:\Users\Welcome\.gemini\antigravity-ide\brain\c3dd5b40-5711-4d77-a83b-9a0c1b40c9d4"
$localScreenshotsDir = "d:\Education Content\Professional website\assets\screenshots"
$docsScreenshotsDir = "d:\Education Content\Professional website\docs\assets\screenshots"
$tempProfile = "C:\Users\Welcome\AppData\Local\Temp\chrome_capture_prof"

# Ensure directories exist
if (!(Test-Path $localScreenshotsDir)) { New-Item -ItemType Directory -Path $localScreenshotsDir -Force | Out-Null }
if (!(Test-Path $docsScreenshotsDir)) { New-Item -ItemType Directory -Path $docsScreenshotsDir -Force | Out-Null }

# Helper to save image to all 3 target locations
function Save-ScreenshotFile {
    param(
        [System.Drawing.Bitmap]$Bitmap,
        [string]$FileName
    )

    $outArtifactPath = Join-Path $artifactDir $FileName
    $outLocalPath = Join-Path $localScreenshotsDir $FileName
    $outDocsPath = Join-Path $docsScreenshotsDir $FileName

    $Bitmap.Save($outArtifactPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $Bitmap.Save($outLocalPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $Bitmap.Save($outDocsPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $w = $Bitmap.Width
    $h = $Bitmap.Height
    $sz = [math]::Round((Get-Item $outArtifactPath).Length / 1KB, 1)

    Write-Output "CAPTURED: $FileName ($w x $h, ${sz}KB)"
}

function Capture-DirectUrl {
    param(
        [string]$Url,
        [int]$Width,
        [int]$Height,
        [string]$FileName,
        [int]$WaitMs = 1800
    )

    $tempOut = Join-Path $artifactDir ("temp_" + $FileName)
    $args = @(
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--user-data-dir=`"$tempProfile`"",
        "--window-size=$Width,$Height",
        "--virtual-time-budget=$WaitMs",
        "--screenshot=`"$tempOut`"",
        "$Url"
    )

    Start-Process -FilePath $chromePath -ArgumentList $args -Wait

    if (Test-Path $tempOut) {
        $bmp = [System.Drawing.Bitmap]::FromFile($tempOut)
        Save-ScreenshotFile -Bitmap $bmp -FileName $FileName
        $bmp.Dispose()
        Remove-Item $tempOut -Force
    } else {
        Write-Warning "FAILED: $FileName"
    }
}

Write-Output "=== 1. CAPTURING DESKTOP DIRECT VIEWS (1366x768) ==="
Capture-DirectUrl -Url "$BaseUrl/" -Width 1366 -Height 768 -FileName "01_intro_encoder.png" -WaitMs 2500
Capture-DirectUrl -Url "$BaseUrl/?intro=0" -Width 1366 -Height 768 -FileName "02_hero_desktop.png" -WaitMs 1500
Capture-DirectUrl -Url "$BaseUrl/?intro=0&modal=apex" -Width 1366 -Height 768 -FileName "04_apex_modal.png" -WaitMs 1800

Write-Output "=== 2. CAPTURING FULL DESKTOP FOR EXACT SECTION CROPS ==="
$fullDesktopPath = Join-Path $artifactDir "full_desktop_temp.png"
$argsDesktop = @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--user-data-dir=`"$tempProfile`"",
    "--window-size=1366,9000",
    "--virtual-time-budget=2500",
    "--screenshot=`"$fullDesktopPath`"",
    "$BaseUrl/?intro=0&reveal=1"
)
Start-Process -FilePath $chromePath -ArgumentList $argsDesktop -Wait

if (Test-Path $fullDesktopPath) {
    $srcDesk = [System.Drawing.Bitmap]::FromFile($fullDesktopPath)
    Write-Output "Loaded Full Desktop: $($srcDesk.Width) x $($srcDesk.Height)"

    # 03. Selected Projects (APEX, controlprotocol, Arise, Mineart)
    $rectProj = New-Object System.Drawing.Rectangle(0, 900, 1366, 768)
    $cropProj = $srcDesk.Clone($rectProj, $srcDesk.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropProj -FileName "03_projects_schematics.png"
    $cropProj.Dispose()

    # 05. Technical Capabilities Matrix
    $rectCap = New-Object System.Drawing.Rectangle(0, 3600, 1366, 768)
    $cropCap = $srcDesk.Clone($rectCap, $srcDesk.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropCap -FileName "05_capabilities_matrix.png"
    $cropCap.Dispose()

    # 06. Engineering Principles & Editorial (Philosophy)
    $rectPrinc = New-Object System.Drawing.Rectangle(0, 5000, 1366, 768)
    $cropPrinc = $srcDesk.Clone($rectPrinc, $srcDesk.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropPrinc -FileName "06_principles_editorial.png"
    $cropPrinc.Dispose()

    # 07. Repositories Catalog (github-index)
    $rectRepo = New-Object System.Drawing.Rectangle(0, 6600, 1366, 768)
    $cropRepo = $srcDesk.Clone($rectRepo, $srcDesk.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropRepo -FileName "07_repositories_catalog.png"
    $cropRepo.Dispose()

    # 08. Contact Gateway
    $rectContact = New-Object System.Drawing.Rectangle(0, 7900, 1366, 768)
    $cropContact = $srcDesk.Clone($rectContact, $srcDesk.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropContact -FileName "08_contact_gateway.png"
    $cropContact.Dispose()

    $srcDesk.Dispose()
    Remove-Item $fullDesktopPath -Force
}

Write-Output "=== 3. CAPTURING SMARTPHONE DIRECT VIEWS (390x844) ==="
Capture-DirectUrl -Url "$BaseUrl/?intro=0" -Width 390 -Height 844 -FileName "09_mobile_hero_centralized.png" -WaitMs 1500
Capture-DirectUrl -Url "$BaseUrl/?intro=0&drawer=1" -Width 390 -Height 844 -FileName "10_mobile_drawer_backdrop.png" -WaitMs 1800
Capture-DirectUrl -Url "$BaseUrl/?intro=0&modal=apex" -Width 390 -Height 844 -FileName "13_mobile_bottom_sheet_modal.png" -WaitMs 1800

Write-Output "=== 4. CAPTURING FULL MOBILE FOR EXACT SECTION CROPS ==="
$fullMobilePath = Join-Path $artifactDir "full_mobile_temp.png"
$argsMobile = @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--user-data-dir=`"$tempProfile`"",
    "--window-size=390,16000",
    "--virtual-time-budget=2500",
    "--screenshot=`"$fullMobilePath`"",
    "$BaseUrl/?intro=0&reveal=1"
)
Start-Process -FilePath $chromePath -ArgumentList $argsMobile -Wait

if (Test-Path $fullMobilePath) {
    $srcMob = [System.Drawing.Bitmap]::FromFile($fullMobilePath)
    Write-Output "Loaded Full Mobile: $($srcMob.Width) x $($srcMob.Height)"

    # 11. Mobile Projects
    $rectMobProj = New-Object System.Drawing.Rectangle(0, 1100, 390, 844)
    $cropMobProj = $srcMob.Clone($rectMobProj, $srcMob.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropMobProj -FileName "11_mobile_project_cards.png"
    $cropMobProj.Dispose()

    # 12. Mobile Repositories (github-index)
    $rectMobRepo = New-Object System.Drawing.Rectangle(0, 10600, 390, 844)
    $cropMobRepo = $srcMob.Clone($rectMobRepo, $srcMob.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropMobRepo -FileName "12_mobile_repo_cards.png"
    $cropMobRepo.Dispose()

    # 14. Mobile Contact Form
    $rectMobContact = New-Object System.Drawing.Rectangle(0, 13500, 390, 844)
    $cropMobContact = $srcMob.Clone($rectMobContact, $srcMob.PixelFormat)
    Save-ScreenshotFile -Bitmap $cropMobContact -FileName "14_mobile_contact_form.png"
    $cropMobContact.Dispose()

    $srcMob.Dispose()
    Remove-Item $fullMobilePath -Force
}

Write-Output "=== ALL 14 SCREENSHOTS SUCCESSFULLY CAPTURED AND ARCHIVED ==="
