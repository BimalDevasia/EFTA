#!/bin/bash

echo "🔧 EFTA Environment Configuration Manager"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "📄 Creating .env.local from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
        echo "⚠️  Please update the values in .env.local with your actual credentials"
    else
        echo "❌ .env.example not found either!"
        exit 1
    fi
else
    echo "✅ .env.local file found"
fi

echo ""
echo "🔍 Current WhatsApp Configuration:"
echo "================================="

# Read WhatsApp numbers from .env.local
if grep -q "BUSINESS_WHATSAPP_NUMBER" .env.local; then
    BUSINESS_NUMBER=$(grep "BUSINESS_WHATSAPP_NUMBER" .env.local | cut -d'=' -f2)
    echo "📱 Business WhatsApp: $BUSINESS_NUMBER"
else
    echo "⚠️  BUSINESS_WHATSAPP_NUMBER not set in .env.local"
fi

if grep -q "CUSTOMER_SUPPORT_PHONE" .env.local; then
    SUPPORT_NUMBER=$(grep "CUSTOMER_SUPPORT_PHONE" .env.local | cut -d'=' -f2)
    echo "📞 Support Phone: $SUPPORT_NUMBER"
else
    echo "⚠️  CUSTOMER_SUPPORT_PHONE not set in .env.local"
fi

echo ""
echo "📋 Environment Variables Checklist:"
echo "==================================="

# Check required variables
check_env_var() {
    local var_name=$1
    local var_description=$2
    
    if grep -q "^$var_name=" .env.local; then
        local value=$(grep "^$var_name=" .env.local | cut -d'=' -f2)
        if [ -n "$value" ] && [ "$value" != "your_value_here" ] && [ "$value" != "your_api_key_here" ]; then
            echo "✅ $var_description: Set"
        else
            echo "⚠️  $var_description: Not configured"
        fi
    else
        echo "❌ $var_description: Missing"
    fi
}

# Check all important environment variables
check_env_var "MONGODB_URI" "MongoDB Database"
check_env_var "CLOUDINARY_CLOUD_NAME" "Cloudinary Cloud Name"
check_env_var "CLOUDINARY_API_KEY" "Cloudinary API Key"
check_env_var "CLOUDINARY_API_SECRET" "Cloudinary API Secret"
check_env_var "JWT_SECRET" "JWT Secret"
check_env_var "BUSINESS_WHATSAPP_NUMBER" "Business WhatsApp Number"
check_env_var "CUSTOMER_SUPPORT_PHONE" "Customer Support Phone"

echo ""
echo "🛠️  Configuration Management:"
echo "============================"
echo ""
echo "To update WhatsApp numbers:"
echo "1. Edit .env.local file"
echo "2. Update BUSINESS_WHATSAPP_NUMBER=+919876543210"
echo "3. Update CUSTOMER_SUPPORT_PHONE=+919876543210"
echo "4. Restart the development server"
echo ""
echo "📝 Example .env.local entries:"
echo "BUSINESS_WHATSAPP_NUMBER=+919876543210"
echo "CUSTOMER_SUPPORT_PHONE=+919876543210"
echo ""
echo "🔄 After making changes, restart with: npm run dev"
echo ""

# Offer to open .env.local for editing
read -p "📝 Do you want to edit .env.local now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v nano &> /dev/null; then
        nano .env.local
    elif command -v vim &> /dev/null; then
        vim .env.local
    elif command -v code &> /dev/null; then
        code .env.local
    else
        echo "Please edit .env.local manually with your preferred editor"
    fi
fi
