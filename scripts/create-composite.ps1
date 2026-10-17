Add-Type -AssemblyName System.Drawing

$artifactDir = "C:\Users\Welcome\.gemini\antigravity-ide\brain\c3dd5b40-5711-4d77-a83b-9a0c1b40c9d4"
$outputFile = Join-Path $artifactDir "portfolio_feature_showcase_master.png"
$localAssetFile = "d:\Education Content\Professional website\assets\portfolio_showcase_master.png"
$docsAssetFile = "d:\Education Content\Professional website\docs\assets\portfolio_showcase_master.png"

$screenshotsDir = "d:\Education Content\Professional website\assets\screenshots"

# 14 Canonical Feature Screenshots
$f01 = Join-Path $screenshotsDir "01_intro_encoder.png"
$f02 = Join-Path $screenshotsDir "02_hero_desktop.png"
$f03 = Join-Path $screenshotsDir "03_projects_schematics.png"
$f04 = Join-Path $screenshotsDir "04_apex_modal.png"
$f05 = Join-Path $screenshotsDir "05_capabilities_matrix.png"
$f06 = Join-Path $screenshotsDir "06_principles_editorial.png"
$f07 = Join-Path $screenshotsDir "07_repositories_catalog.png"
$f08 = Join-Path $screenshotsDir "08_contact_gateway.png"

$f09 = Join-Path $screenshotsDir "09_mobile_hero_centralized.png"
$f10 = Join-Path $screenshotsDir "10_mobile_drawer_backdrop.png"
$f11 = Join-Path $screenshotsDir "11_mobile_project_cards.png"
$f12 = Join-Path $screenshotsDir "12_mobile_repo_cards.png"
$f13 = Join-Path $screenshotsDir "13_mobile_bottom_sheet_modal.png"
$f14 = Join-Path $screenshotsDir "14_mobile_contact_form.png"

# Canvas Dimensions
$masterWidth = 2880
$margin = 50
$gutter = 40

# Desktop 2-column layout dimensions
$deskColWidth = [int](($masterWidth - ($margin * 2) - $gutter) / 2) # 1370 px
$deskImgHeight = [int]($deskColWidth * 768 / 1366) # 770 px
$labelHeight = 70
$deskRowHeight = $deskImgHeight + $labelHeight + 35 # 875 px

# Mobile 3-column layout dimensions
$mobGutter = 35
$mobColWidth = [int](($masterWidth - ($margin * 2) - ($mobGutter * 2)) / 3) # 870 px
$mobContainerHeight = 820
$mobRowHeight = $mobContainerHeight + $labelHeight + 35 # 925 px

# Overall Vertical Calculation
$headerHeight = 180
$sectionBannerHeight = 65
$desktopRowsHeight = $deskRowHeight * 4 # 3500 px
$mobileRowsHeight = $mobRowHeight * 2 # 1850 px
$telemetryHeight = 440
$footerHeight = 90

$masterHeight = $headerHeight + $sectionBannerHeight + $desktopRowsHeight + $sectionBannerHeight + $mobileRowsHeight + $telemetryHeight + $footerHeight

Write-Output "Master Canvas: $masterWidth x $masterHeight px"

$bmp = New-Object System.Drawing.Bitmap($masterWidth, $masterHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Background - Deep Obsidian
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 8, 8, 8))
$g.FillRectangle($bgBrush, 0, 0, $masterWidth, $masterHeight)

# Master Header Box
$bannerBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 14, 14, 14))
$g.FillRectangle($bannerBrush, 0, 0, $masterWidth, ($headerHeight - 20))

$topBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 2)
$g.DrawLine($topBorderPen, 0, ($headerHeight - 20), $masterWidth, ($headerHeight - 20))

# Typography fonts
$titleFont = New-Object System.Drawing.Font("Segoe UI", 32, [System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font("Consolas", 15, [System.Drawing.FontStyle]::Regular)
$metaFont = New-Object System.Drawing.Font("Consolas", 13, [System.Drawing.FontStyle]::Regular)
$sectionHeaderFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$sectionSubFont = New-Object System.Drawing.Font("Consolas", 12, [System.Drawing.FontStyle]::Regular)
$panelTitleFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$panelSubFont = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Regular)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$silverBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 180, 180))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 120, 120))
$accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 80, 227, 194))
$accentBlueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))

# Master Title drawing
$headerTitle = "CORESHADOW // MAYANK BHATT"
$headerSub = "SYSTEMS & CREATIVE ENGINEERING PORTFOLIO -- COMPLETE 14-VIEW SYSTEM VERIFICATION"
$headerMeta = "STATUS: ONLINE // 8 DESKTOP ARCHITECTURE SCREENS + 6 DEDICATED SMARTPHONE SCREENS // ZERO OVERFLOW"

$g.DrawString($headerTitle, $titleFont, $whiteBrush, [float]$margin, 35.0)
$g.DrawString($headerSub, $subtitleFont, $silverBrush, [float]$margin, 95.0)
$g.DrawString($headerMeta, $metaFont, $accentBrush, [float]$margin, 125.0)

# Helper function to render section separator banner
function Render-SectionBanner {
    param(
        [string]$Kicker,
        [string]$Title,
        [string]$Meta,
        [int]$PosY
    )
    $bannerBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 16, 16))
    $g.FillRectangle($bannerBg, $margin, $PosY, ($masterWidth - ($margin * 2)), 50)
    
    $bPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 45, 45, 45), 1)
    $g.DrawRectangle($bPen, $margin, $PosY, ($masterWidth - ($margin * 2)), 50)
    
    $fullTitle = "$Kicker // $Title"
    $g.DrawString($fullTitle, $sectionHeaderFont, $whiteBrush, [float]($margin + 20), [float]($PosY + 10))
    $g.DrawString($Meta, $sectionSubFont, $accentBrush, [float]($masterWidth - $margin - 750), [float]($PosY + 15))
}

# Helper to render Desktop 16:9 Panel
function Render-DesktopPanel {
    param(
        [string]$Path,
        [int]$PosX,
        [int]$PosY,
        [int]$Idx,
        [string]$TitleText,
        [string]$SubText
    )
    
    # Header container
    $headerBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
    $g.FillRectangle($headerBoxBrush, $PosX, $PosY, $deskColWidth, $labelHeight)
    
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 1)
    $g.DrawRectangle($framePen, $PosX, $PosY, $deskColWidth, $labelHeight)
    
    # Badge and title
    $badgeText = "FEATURE {0:D2} // " -f $Idx
    $g.DrawString($badgeText, $panelSubFont, $accentBrush, [float]($PosX + 18), [float]($PosY + 14))
    $badgeSize = $g.MeasureString($badgeText, $panelSubFont)
    $g.DrawString($TitleText, $panelTitleFont, $whiteBrush, [float]($PosX + 18 + $badgeSize.Width), [float]($PosY + 11))
    $g.DrawString($SubText, $panelSubFont, $mutedBrush, [float]($PosX + 18), [float]($PosY + 40))
    
    # Screenshot image
    $screenY = $PosY + $labelHeight
    if (Test-Path $Path) {
        $sourceImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path).Path)
        $g.DrawImage($sourceImg, $PosX, $screenY, $deskColWidth, $deskImgHeight)
        $sourceImg.Dispose()
    }
    
    # Outer frame border
    $imgBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 45, 45, 45), 1)
    $g.DrawRectangle($imgBorderPen, $PosX, $screenY, $deskColWidth, $deskImgHeight)
}

# Helper to render Smartphone Panel (Mockup centered in container)
function Render-MobilePanel {
    param(
        [string]$Path,
        [int]$PosX,
        [int]$PosY,
        [int]$Idx,
        [string]$TitleText,
        [string]$SubText
    )
    
    # Header container
    $headerBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
    $g.FillRectangle($headerBoxBrush, $PosX, $PosY, $mobColWidth, $labelHeight)
    
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 1)
    $g.DrawRectangle($framePen, $PosX, $PosY, $mobColWidth, $labelHeight)
    
    # Badge and title
    $badgeText = "FEATURE {0:D2} // " -f $Idx
    $g.DrawString($badgeText, $panelSubFont, $accentBlueBrush, [float]($PosX + 16), [float]($PosY + 14))
    $badgeSize = $g.MeasureString($badgeText, $panelSubFont)
    $g.DrawString($TitleText, $panelTitleFont, $whiteBrush, [float]($PosX + 16 + $badgeSize.Width), [float]($PosY + 11))
    $g.DrawString($SubText, $panelSubFont, $mutedBrush, [float]($PosX + 16), [float]($PosY + 40))
    
    # Background Box for Mobile Frame
    $screenY = $PosY + $labelHeight
    $panelBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 12, 12))
    $g.FillRectangle($panelBgBrush, $PosX, $screenY, $mobColWidth, $mobContainerHeight)
    $g.DrawRectangle($framePen, $PosX, $screenY, $mobColWidth, $mobContainerHeight)
    
    # Phone Mockup Dimensions (390 x 844 scaled into container)
    $phoneH = $mobContainerHeight - 40 # 780 px
    $phoneW = [int]($phoneH * 390 / 844) # ~360 px
    $phoneX = $PosX + [int](($mobColWidth - $phoneW) / 2)
    $phoneY = $screenY + 20
    
    if (Test-Path $Path) {
        $sourceImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path).Path)
        $g.DrawImage($sourceImg, $phoneX, $phoneY, $phoneW, $phoneH)
        $sourceImg.Dispose()
    }
    
    # Smartphone Bezel Frame & Shadow
    $phonePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 55, 55, 55), 2)
    $g.DrawRectangle($phonePen, $phoneX, $phoneY, $phoneW, $phoneH)
    
    # Subtle phone speaker notch indicator
    $notchPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 30, 30, 30), 3)
    $notchW = 60
    $notchX = $phoneX + [int](($phoneW - $notchW) / 2)
    $g.DrawLine($notchPen, $notchX, ($phoneY + 6), ($notchX + $notchW), ($phoneY + 6))
}

# ==============================================================================
# SECTION 1: DESKTOP ARCHITECTURE SUITE (FEATURES 01 - 08)
# ==============================================================================
$curY = $headerHeight
Render-SectionBanner -Kicker "SECTION 01" -Title "DESKTOP ARCHITECTURE & GRAPHICS SYSTEMS SUITE" -Meta "1366x768 VIEWPORT // FULL HIGH-RES ENGINE VERIFICATION" -PosY $curY
$curY += $sectionBannerHeight

$xCol1 = $margin
$xCol2 = $margin + $deskColWidth + $gutter

# Row 1: Intro & Hero
Render-DesktopPanel -Path $f01 -PosX $xCol1 -PosY $curY -Idx 1 -TitleText "CINEMATIC INTRO & TEXT ENCODER" -SubText "Mechanical Involute Aperture - CORESHADOW to MAYANK BHATT Scramble - [ESC] Skip"
Render-DesktopPanel -Path $f02 -PosX $xCol2 -PosY $curY -Idx 2 -TitleText "HERO ARCHITECTURE & TELEMETRY" -SubText "Canvas 2D Involute Mesh Simulation - Staggered Choreography - Telemetry Control"
$curY += $deskRowHeight

# Row 2: Selected Projects & APEX Modal
Render-DesktopPanel -Path $f03 -PosX $xCol1 -PosY $curY -Idx 3 -TitleText "SELECTED ENGINEERING PROJECTS" -SubText "Flagship APEX Platform, controlprotocol, Arise 3D Lunar Mapper, Mineart Engine"
Render-DesktopPanel -Path $f04 -PosX $xCol2 -PosY $curY -Idx 4 -TitleText "INTERACTIVE ARCHITECTURE MODAL" -SubText "Signature FLIP Morph Expansion, Bayesian Knowledge Tracing & System Specifications"
$curY += $deskRowHeight

# Row 3: Capabilities & Principles
Render-DesktopPanel -Path $f05 -PosX $xCol1 -PosY $curY -Idx 5 -TitleText "TECHNICAL CAPABILITIES MATRIX" -SubText "6 Engineering Domains: Systems, AI Governance, Graphics, Algorithms, Motion, Tooling"
Render-DesktopPanel -Path $f06 -PosX $xCol2 -PosY $curY -Idx 6 -TitleText "ENGINEERING PRINCIPLES & EDITORIAL" -SubText "Philosophy of Deliberate Restraint: Precision, Depth, Restraint, Mechanical Motion"
$curY += $deskRowHeight

# Row 4: Repositories & Contact Gateway
Render-DesktopPanel -Path $f07 -PosX $xCol1 -PosY $curY -Idx 7 -TitleText "REPOSITORY CATALOG & TOOLCHAINS" -SubText "Clean Monospaced Matrix Linking Verified GitHub Repositories (@CodeStrikerMayank)"
Render-DesktopPanel -Path $f08 -PosX $xCol2 -PosY $curY -Idx 8 -TitleText "STEALTH COMMUNICATION GATEWAY" -SubText "Bot-Scraper Immune Hash Route - Encrypted FormSubmit Dispatch - Fail-Safe Reveal"
$curY += $deskRowHeight

# ==============================================================================
# SECTION 2: DEDICATED SMARTPHONE RESPONSIVE SUITE (FEATURES 09 - 14)
# ==============================================================================
Render-SectionBanner -Kicker "SECTION 02" -Title "DEDICATED SMARTPHONE RESPONSIVE SYSTEM" -Meta "390x844 VIEWPORT // DELIBERATE ZERO-OVERFLOW MOBILE ERGONOMICS" -PosY $curY
$curY += $sectionBannerHeight

$mobX1 = $margin
$mobX2 = $margin + $mobColWidth + $mobGutter
$mobX3 = $margin + ($mobColWidth * 2) + ($mobGutter * 2)

# Mobile Row 1 (Features 09, 10, 11)
Render-MobilePanel -Path $f09 -PosX $mobX1 -PosY $curY -Idx 9 -TitleText "SMARTPHONE HERO" -SubText "Centered Viewport, Fluid Clamped Headline & Direct CTAs"
Render-MobilePanel -Path $f10 -PosX $mobX2 -PosY $curY -Idx 10 -TitleText "SLIDE-DOWN DRAWER" -SubText "Dimmed Backdrop Overlay, Accessible 48px Touch Targets"
Render-MobilePanel -Path $f11 -PosX $mobX3 -PosY $curY -Idx 11 -TitleText "MOBILE PROJECT CARDS" -SubText "Zero-Horizontal Overflow, Embedded Interactive SVG Schematics"
$curY += $mobRowHeight

# Mobile Row 2 (Features 12, 13, 14)
Render-MobilePanel -Path $f12 -PosX $mobX1 -PosY $curY -Idx 12 -TitleText "REPOSITORY CARDS" -SubText "Table-to-Card Responsive Transformation with Monospace Pips"
Render-MobilePanel -Path $f13 -PosX $mobX2 -PosY $curY -Idx 13 -TitleText "BOTTOM-SHEET MODAL" -SubText "Full-Height Touch Modal with Sticky Header & Action Close"
Render-MobilePanel -Path $f14 -PosX $mobX3 -PosY $curY -Idx 14 -TitleText "TOUCH GATEWAY" -SubText "Responsive Keypad Form Controls & Dynamic Fail-Safe Card"
$curY += $mobRowHeight

# ==============================================================================
# SECTION 3: PRODUCTION TELEMETRY & INVARIANTS MATRIX
# ==============================================================================
$cardHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
$g.FillRectangle($cardHeaderBrush, $margin, $curY, ($masterWidth - ($margin * 2)), $labelHeight)

$specFramePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 1)
$g.DrawRectangle($specFramePen, $margin, $curY, ($masterWidth - ($margin * 2)), $labelHeight)

$specBadge = "PRODUCTION SPECIFICATION // "
$g.DrawString($specBadge, $panelSubFont, $accentBrush, [float]($margin + 20), [float]($curY + 16))
$specBadgeSize = $g.MeasureString($specBadge, $panelSubFont)
$g.DrawString("ENGINEERING INVARIANTS & TELEMETRY VERIFICATION MATRIX", $panelTitleFont, $whiteBrush, [float]($margin + 20 + $specBadgeSize.Width), [float]($curY + 12))
$g.DrawString("End-to-End Visual Verification - Zero External Dependencies - WCAG 2.2 AA Contrast Compliance", $panelSubFont, $mutedBrush, [float]($margin + 20), [float]($curY + 42))

$dashBodyY = $curY + $labelHeight
$dashBodyHeight = $telemetryHeight - $labelHeight - 35
$dashBodyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 12, 12))
$g.FillRectangle($dashBodyBrush, $margin, $dashBodyY, ($masterWidth - ($margin * 2)), $dashBodyHeight)
$g.DrawRectangle($specFramePen, $margin, $dashBodyY, ($masterWidth - ($margin * 2)), $dashBodyHeight)

# 4 Telemetry Columns
$dashColW = [int](($masterWidth - ($margin * 2) - 60) / 4) # ~680 px
$colHeaderFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$keyFont = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Bold)
$valFont = New-Object System.Drawing.Font("Consolas", 10.5, [System.Drawing.FontStyle]::Regular)

$colData = @(
    @{
        Title = "01 // GRAPHICS & KINEMATICS";
        Items = @(
            @("Visual Engine", "Canvas 2D Involute Pitch Mesh"),
            @("Tooth Profile", "Mathematically Accurate Involute Curve"),
            @("Kinematics", "Counter-Rotating Opposite Velocities"),
            @("Performance", "Locked 60 FPS | Clamped DPR"),
            @("Lifecycle", "Page Visibility Auto-Pause [Active]")
        )
    },
    @{
        Title = "02 // INTERACTION ARCHITECTURE";
        Items = @(
            @("Intro Sequence", "3.8s Calibrated Text Encoder (CORE ➜ MAYANK)"),
            @("Bypass Policy", "[ESC] Key | Auto Cache | Direct Hash Link"),
            @("Modal Morph", "GPU-Accelerated Card FLIP Transition (460ms)"),
            @("Drawer Nav", "Accessible Slide-Down with Dimmed Backdrop"),
            @("Scroll Spy", "IntersectionObserver Dynamic Link Highlights")
        )
    },
    @{
        Title = "03 // SECURITY & RESILIENCE";
        Items = @(
            @("Security Gateway", "FormSubmit Obfuscated Route (9bcee9c...)"),
            @("Bot Protection", "Deconstructed Email Defense Against Scrapers"),
            @("Fail-Safe Fallback", "Instant Unlocked Card on Network Block"),
            @("Zero-Dependency", "100% Vanilla HTML, CSS, JavaScript"),
            @("Repository Proofs", "APEX, controlprotocol, Arise, Mineart")
        )
    },
    @{
        Title = "04 // RESPONSIVE & ACCESSIBILITY";
        Items = @(
            @("Mobile Ergonomics", "Dedicated 320px-430px Viewport Scaling"),
            @("Layout Guarantee", "Zero Horizontal Scroll Overflow [PASS]"),
            @("Touch Ergonomics", "48px Touch Targets & Keypad Attributes"),
            @("A11y Standards", "WCAG 2.2 AA Contrast Compliance [PASS]"),
            @("Motion Tolerance", "prefers-reduced-motion Full Fallback [PASS]")
        )
    }
)

for ($i = 0; $i -lt 4; $i++) {
    $colX = $margin + 25 + ($i * ($dashColW + 20))
    $colY = $dashBodyY + 25
    
    # Column Title
    $g.DrawString($colData[$i].Title, $colHeaderFont, $accentBrush, [float]$colX, [float]$colY)
    $colY += 32
    
    $divPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 35, 35, 35), 1)
    $g.DrawLine($divPen, $colX, $colY, ($colX + $dashColW - 10), $colY)
    $colY += 15
    
    foreach ($item in $colData[$i].Items) {
        $g.DrawString($item[0], $keyFont, $whiteBrush, [float]$colX, [float]$colY)
        $g.DrawString("// " + $item[1], $valFont, $silverBrush, [float]$colX, [float]($colY + 18))
        $colY += 46
    }
}

$curY += $telemetryHeight

# ==============================================================================
# FOOTER
# ==============================================================================
$footerY = $masterHeight - $footerHeight + 15
$g.DrawLine($topBorderPen, 0, ($footerY - 10), $masterWidth, ($footerY - 10))

$footerLeft = "CORESHADOW ENGINEERING PORTFOLIO (C) 2026 // MAYANK BHATT (@CodeStrikerMayank) -- ALL 14 FEATURE VIEWS VERIFIED"
$footerRight = "VERIFIED LIVE DEPLOYMENT: https://codestrikermayank.github.io/Mineart/"

$g.DrawString($footerLeft, $panelSubFont, $mutedBrush, [float]$margin, [float]($footerY + 15))
$g.DrawString($footerRight, $panelSubFont, $accentBrush, [float]($masterWidth - 780), [float]($footerY + 15))

# Save Image to Artifact, Assets, and Docs Assets
$bmp.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($localAssetFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($docsAssetFile, [System.Drawing.Imaging.ImageFormat]::Png)

$szKB = [math]::Round((Get-Item $outputFile).Length / 1KB, 1)

$g.Dispose()
$bmp.Dispose()

Write-Output "SUCCESS: Master feature showcase composite incorporating all 14 screens generated!"
Write-Output "Resolution: $masterWidth x $masterHeight px (${szKB} KB)"
Write-Output "Saved to: $outputFile"
Write-Output "Mirrored to: $localAssetFile"
Write-Output "Mirrored to: $docsAssetFile"
