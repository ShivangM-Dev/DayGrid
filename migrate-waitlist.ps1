# DayGrid Waitlist Migration Script for PowerShell
# This script helps you create the waitlist table in Supabase

Write-Host "🚀 DayGrid Waitlist Migration" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if supabase CLI is installed
try {
    $supabaseVersion = & supabase --version 2>$null
    Write-Host "✅ Supabase CLI detected: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it first: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Migration options
Write-Host "Choose migration method:" -ForegroundColor White
Write-Host "1) Display SQL to run manually in Supabase Dashboard" -ForegroundColor White
Write-Host "2) Copy SQL to clipboard" -ForegroundColor White
Write-Host "3) Save SQL file" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

$sqlContent = Get-Content "backend\Database\migrations\001_create_waitlist.sql" -Raw

switch ($choice) {
    "1" {
        Write-Host "📝 Please run the following SQL in your Supabase SQL Editor:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host $sqlContent -ForegroundColor Gray
        Write-Host ""
        Write-Host "🌐 Opening Supabase Dashboard..." -ForegroundColor Blue
        & supabase dashboard
    }
    "2" {
        try {
            $sqlContent | Set-Clipboard
            Write-Host "✅ SQL copied to clipboard!" -ForegroundColor Green
            Write-Host "   Paste it in your Supabase SQL Editor" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Failed to copy to clipboard" -ForegroundColor Red
            Write-Host "Please copy the SQL manually from the file:" -ForegroundColor Yellow
            Write-Host "   backend\Database\migrations\001_create_waitlist.sql" -ForegroundColor Gray
        }
    }
    "3" {
        $sqlContent | Out-File -FilePath "waitlist_migration.sql" -Encoding UTF8
        Write-Host "✅ SQL file created: waitlist_migration.sql" -ForegroundColor Green
        Write-Host "   Run this file in your Supabase SQL Editor" -ForegroundColor Gray
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Migration process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run the SQL in Supabase Dashboard" -ForegroundColor Gray
Write-Host "   2. Update the admin email in the RLS policies" -ForegroundColor Gray
Write-Host "   3. Test the waitlist functionality" -ForegroundColor Gray