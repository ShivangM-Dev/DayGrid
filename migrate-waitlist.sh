#!/bin/bash

# DayGrid Waitlist Migration Script
# This script helps you create the waitlist table in Supabase

echo "🚀 DayGrid Waitlist Migration"
echo "=============================="
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first: npm install -g supabase"
    exit 1
fi

# Check if we're in a supabase project
if [ ! -d "supabase" ]; then
    echo "❌ Not in a Supabase project directory."
    echo "Please run: supabase init"
    exit 1
fi

echo "✅ Supabase CLI detected"
echo ""

# Migration options
echo "Choose migration method:"
echo "1) Push to Supabase (requires linked project)"
echo "2) Generate SQL file to run manually"
echo "3) Open Supabase Dashboard (run SQL manually)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "📤 Pushing migration to Supabase..."
        supabase db push
        if [ $? -eq 0 ]; then
            echo "✅ Migration completed successfully!"
        else
            echo "❌ Migration failed. Please check your Supabase configuration."
        fi
        ;;
    2)
        echo "📄 Generating SQL file..."
        cp backend/Database/migrations/001_create_waitlist.sql waitlist_migration.sql
        echo "✅ SQL file created: waitlist_migration.sql"
        echo "   Run this file in your Supabase SQL Editor"
        ;;
    3)
        echo "🌐 Opening Supabase Dashboard..."
        echo "📝 Please run the following SQL in your Supabase SQL Editor:"
        echo ""
        cat backend/Database/migrations/001_create_waitlist.sql
        echo ""
        echo "Opening dashboard..."
        supabase dashboard
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Migration process completed!"