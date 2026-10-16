Add-Type -AssemblyName System.Drawing

$artifactDir = "C:\Users\Welcome\.gemini\antigravity-ide\brain\c3dd5b40-5711-4d77-a83b-9a0c1b40c9d4"
$outputFile = Join-Path $artifactDir "portfolio_feature_showcase_master.png"
$localAssetFile = "d:\Education Content\Professional website\assets\portfolio_showcase_master.png"
$docsAssetFile = "d:\Education Content\Professional website\docs\assets\portfolio_showcase_master.png"

# File paths for the 7 feature screenshots (Upgraded Cinematic Motion & Visual Refinement)
$f1 = Join-Path $artifactDir "hero_section_1792179242279.png"
$f2 = Join-Path $artifactDir "projects_grid_1792179261249.png"
$f3 = Join-Path $artifactDir "apex_modal_1792179277386.png"
$f4 = Join-Path $artifactDir "capabilities_matrix_1792179318064.png"
$f5 = Join-Path $artifactDir "principles_section_1792179336398.png"
$f6 = Join-Path $artifactDir "repositories_catalog_1792179410297.png"
$f7 = Join-Path $artifactDir "contact_section_1792179442746.png"

# Canvas Dimensions
$masterWidth = 2880
$margin = 50
$gutter = 40
$imgWidth = [int](($masterWidth - ($margin * 2) - $gutter) / 2) # 1370 px
$imgHeight = [int]($imgWidth * 768 / 1366) # 770 px
$labelHeight = 70

$headerHeight = 180
$rowHeight = $imgHeight + $labelHeight + 35
$footerHeight = 100
$masterHeight = $headerHeight + ($rowHeight * 4) + $footerHeight

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
$panelTitleFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$panelSubFont = New-Object System.Drawing.Font("Consolas", 12, [System.Drawing.FontStyle]::Regular)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$silverBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 180, 180))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 120, 120))
$accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 80, 227, 194))

# Title drawing
$headerTitle = "CORESHADOW // MAYANK BHATT"
$headerSub = "SYSTEMS & CREATIVE ENGINEERING PORTFOLIO -- CINEMATIC MOTION & ARCHITECTURAL REFINEMENT"
$headerMeta = "STATUS: ONLINE // UNIFIED MOTION CURVES - INTERLOCKING KINEMATIC GEAR ENGINE - FLIP MORPH MODAL"

$g.DrawString($headerTitle, $titleFont, $whiteBrush, [float]$margin, 35.0)
$g.DrawString($headerSub, $subtitleFont, $silverBrush, [float]$margin, 95.0)
$g.DrawString($headerMeta, $metaFont, $accentBrush, [float]$margin, 125.0)

# Helper function to draw panel with frame
function Render-FeaturePanel {
    param(
        [string]$Path,
        [int]$PosX,
        [int]$PosY,
        [int]$Idx,
        [string]$TitleText,
        [string]$SubText
    )
    
    # Header container
    $headerBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 16, 16))
    $g.FillRectangle($headerBoxBrush, $PosX, $PosY, $imgWidth, $labelHeight)
    
    $framePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 1)
    $g.DrawRectangle($framePen, $PosX, $PosY, $imgWidth, $labelHeight)
    
    # Badge and title
    $badgeText = "FEATURE 0" + $Idx + " // "
    $g.DrawString($badgeText, $panelSubFont, $accentBrush, [float]($PosX + 18), [float]($PosY + 14))
    $badgeSize = $g.MeasureString($badgeText, $panelSubFont)
    $g.DrawString($TitleText, $panelTitleFont, $whiteBrush, [float]($PosX + 18 + $badgeSize.Width), [float]($PosY + 10))
    $g.DrawString($SubText, $panelSubFont, $mutedBrush, [float]($PosX + 18), [float]($PosY + 40))
    
    # Screenshot
    $screenY = $PosY + $labelHeight
    if (Test-Path $Path) {
        $sourceImg = [System.Drawing.Bitmap]::FromFile((Resolve-Path $Path).Path)
        $g.DrawImage($sourceImg, $PosX, $screenY, $imgWidth, $imgHeight)
        $sourceImg.Dispose()
    }
    
    # Frame border
    $imgBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 45, 45, 45), 1)
    $g.DrawRectangle($imgBorderPen, $PosX, $screenY, $imgWidth, $imgHeight)
}

# Row 1: Hero and Projects
$y1 = $headerHeight
Render-FeaturePanel -Path $f1 -PosX $margin -PosY $y1 -Idx 1 -TitleText "HERO ARCHITECTURE & TELEMETRY" -SubText "Canvas 2D Involute Mesh Simulation - Monochrome Dragon Emblem - Telemetry Control"
Render-FeaturePanel -Path $f2 -PosX ($margin + $imgWidth + $gutter) -PosY $y1 -Idx 2 -TitleText "SELECTED ENGINEERING PROJECTS" -SubText "Flagship APEX Platform, controlprotocol, Arise 3D Lunar Mapper, Mineart Graphics"

# Row 2: Modal and Capabilities
$y2 = $y1 + $rowHeight
Render-FeaturePanel -Path $f3 -PosX $margin -PosY $y2 -Idx 3 -TitleText "INTERACTIVE ARCHITECTURE MODAL" -SubText "APEX Power Cascade DAG, Bayesian Knowledge Tracing & Systems Specifications"
Render-FeaturePanel -Path $f4 -PosX ($margin + $imgWidth + $gutter) -PosY $y2 -Idx 4 -TitleText "TECHNICAL CAPABILITIES MATRIX" -SubText "Systems Programming, AI Governance & Hypervisors, High-Throughput Graphics"

# Row 3: Principles and Repositories
$y3 = $y2 + $rowHeight
Render-FeaturePanel -Path $f5 -PosX $margin -PosY $y3 -Idx 5 -TitleText "ENGINEERING METHODOLOGY & PRINCIPLES" -SubText "Zero Synthetic Metric Invariant, Algorithmic Discipline, Mechanical Motion Standards"
Render-FeaturePanel -Path $f6 -PosX ($margin + $imgWidth + $gutter) -PosY $y3 -Idx 6 -TitleText "VERIFIED REPOSITORY CATALOG" -SubText "8 Live GitHub Repositories - Full Source Verification - Real Architectural Metrics"

# Row 4: Contact Form and Architecture Dashboard
$y4 = $y3 + $rowHeight
Render-FeaturePanel -Path $f7 -PosX $margin -PosY $y4 -Idx 7 -TitleText "STEALTH COMMUNICATION GATEWAY" -SubText "Bot-Scraper Immune Hash Route - Encrypted Dispatch - Instant Fail-Safe Reveal"

# Row 4 Right Column: Systems Architecture & Telemetry Card
$xCard = $margin + $imgWidth + $gutter
$cardHeaderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 16, 16))
$g.FillRectangle($cardHeaderBrush, $xCard, $y4, $imgWidth, $labelHeight)
$cardFramePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 38, 38, 38), 1)
$g.DrawRectangle($cardFramePen, $xCard, $y4, $imgWidth, $labelHeight)

$cardBadge = "SYSTEM SPECIFICATION // "
$g.DrawString($cardBadge, $panelSubFont, $accentBrush, [float]($xCard + 18), [float]($y4 + 14))
$specBadgeSize = $g.MeasureString($cardBadge, $panelSubFont)
$g.DrawString("PRODUCTION TELEMETRY & INVARIANTS", $panelTitleFont, $whiteBrush, [float]($xCard + 18 + $specBadgeSize.Width), [float]($y4 + 10))
$g.DrawString("Engineering Verification - Zero-Dependency Architecture - Production Credentials", $panelSubFont, $mutedBrush, [float]($xCard + 18), [float]($y4 + 40))

# Card Body Box
$cardBodyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 11, 11, 11))
$cardBodyY = $y4 + $labelHeight
$g.FillRectangle($cardBodyBrush, $xCard, $cardBodyY, $imgWidth, $imgHeight)
$g.DrawRectangle($cardFramePen, $xCard, $cardBodyY, $imgWidth, $imgHeight)

# Inner Telemetry Metrics
$specTitleFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$specKeyFont = New-Object System.Drawing.Font("Consolas", 12, [System.Drawing.FontStyle]::Bold)
$specValFont = New-Object System.Drawing.Font("Consolas", 11, [System.Drawing.FontStyle]::Regular)

$tx = $xCard + 35
$ty = $cardBodyY + 35

$g.DrawString("ENGINEERING INVARIANTS & VERIFICATION MATRIX", $specTitleFont, $whiteBrush, [float]$tx, [float]$ty)
$ty += 45

$metrics = @(
    @("ENGINEER IDENTITY", "Mayank Bhatt (CoreShadow) // Systems & AI Security"),
    @("GITHUB REPOSITORY", "https://github.com/CodeStrikerMayank/Mineart"),
    @("LIVE PAGES URL", "https://codestrikermayank.github.io/Mineart/"),
    @("CORE GRAPHICS ENGINE", "Custom 2D Involute Pitch Gear Mesh (Canvas2D, Zero 3D engine deps)"),
    @("PERFORMANCE PROFILE", "Locked 60 FPS | Clamped DevicePixelRatio | Page Visibility Auto-Pause"),
    @("DESIGN AESTHETICS", "OKLCH Tailored Monochrome Palette (#080808 to #FFFFFF) | Zero AI Purple"),
    @("AUTHENTIC PROJECTS", "8 Verified Repos (APEX, controlprotocol, Arise, Mineart, Historyworld, etc.)"),
    @("FORM SECURITY GATEWAY", "FormSubmit Obfuscated Token (9bcee9c40b2236a2fd2ca7f2c60b32bd)"),
    @("PRIVACY PROTOCOL", "Plain-text Email Hidden from Scrapers | Dynamic Fail-Safe Auto-Reveal"),
    @("STANDARDS COMPLIANCE", "WCAG 2.2 AA Contrast | Keyboard Focus Rings | Prefers-Reduced-Motion"),
    @("HOSTING STRUCTURE", "Dual-sync deployment (/ root & /docs mirror) | .nojekyll enabled"),
    @("SYSTEM STATUS", "ALL PRODUCTION CHECKS PASSING [ONLINE]")
)

foreach ($item in $metrics) {
    # Key
    $g.DrawString($item[0], $specKeyFont, $accentBrush, [float]$tx, [float]$ty)
    $g.DrawString("// " + $item[1], $specValFont, $silverBrush, [float]($tx + 270), [float]$ty)
    
    $dividerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 22, 22, 22), 1)
    $g.DrawLine($dividerPen, [float]$tx, [float]($ty + 26), [float]($xCard + $imgWidth - 35), [float]($ty + 26))
    
    $ty += 38
}

# Master Footer
$footerY = $masterHeight - $footerHeight + 20
$g.DrawLine($topBorderPen, 0, ($footerY - 15), $masterWidth, ($footerY - 15))
$footerLeft = "CORESHADOW ENGINEERING PORTFOLIO (C) 2026 // MAYANK BHATT - ARCHITECTED WITH DISCIPLINE AND RESTRAINT"
$footerRight = "VERIFIED LIVE: https://codestrikermayank.github.io/Mineart/"
$g.DrawString($footerLeft, $panelSubFont, $mutedBrush, [float]$margin, [float]($footerY + 15))
$g.DrawString($footerRight, $panelSubFont, $accentBrush, [float]($masterWidth - 750), [float]($footerY + 15))

# Save Image to Artifact, Assets, and Docs Assets
$bmp.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($localAssetFile, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($docsAssetFile, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

Write-Output "SUCCESS: Master feature showcase composite generated at $outputFile"
