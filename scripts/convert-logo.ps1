Add-Type -AssemblyName System.Drawing

$srcFile = Join-Path $PSScriptRoot "..\assets\mayank-profile.jpg"
$destFile = Join-Path $PSScriptRoot "..\assets\mayank-profile.jpg"
$docsDestFile = Join-Path $PSScriptRoot "..\docs\assets\mayank-profile.jpg"

$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $srcFile).Path)
$width = $bmp.Width
$height = $bmp.Height

$resultBmp = New-Object System.Drawing.Bitmap($width, $height)

# High contrast monochrome conversion boosting cyan and blue luminosity to pure bright silver/white
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Weight blues and cyans higher so the glowing emblem becomes luminous white
        $lum = [int]([Math]::Min(255, ($c.R * 0.25) + ($c.G * 0.45) + ($c.B * 0.85)))
        # Boost contrast: darken low blacks, brighten glowing contours
        if ($lum -lt 40) {
            $lum = [int]($lum * 0.4)
        } else {
            $lum = [int]([Math]::Min(255, 40 + ($lum - 40) * 1.35))
        }
        $newColor = [System.Drawing.Color]::FromArgb($c.A, $lum, $lum, $lum)
        $resultBmp.SetPixel($x, $y, $newColor)
    }
}

$bmp.Dispose()

# Save converted monochrome image
$resultBmp.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$resultBmp.Save($docsDestFile, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$resultBmp.Dispose()

Write-Output "Monochrome conversion complete."
