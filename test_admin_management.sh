#!/bin/bash

# Test script for admin management functionality

echo "🧪 Testing Admin Management System"
echo "================================="

# Test 1: Login with default admin
echo "📝 Test 1: Login with default admin credentials"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "bimaldevasia@gmail.com", "password": "12345678"}' \
  -c cookies.txt \
  -s -o /dev/null -w "HTTP Status: %{http_code}\n"

echo ""

# Test 2: Get admin list (requires authentication)
echo "📝 Test 2: Fetch admin list"
curl -X GET http://localhost:3000/api/admins \
  -b cookies.txt \
  -s -w "HTTP Status: %{http_code}\n" \
  | head -5

echo ""

# Test 3: Add new admin
echo "📝 Test 3: Add new admin"
curl -X POST http://localhost:3000/api/admins \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123", "name": "Test Admin", "role": "admin"}' \
  -b cookies.txt \
  -s -w "HTTP Status: %{http_code}\n" \
  | head -3

echo ""

# Test 4: Get updated admin list
echo "📝 Test 4: Fetch updated admin list"
curl -X GET http://localhost:3000/api/admins \
  -b cookies.txt \
  -s -w "HTTP Status: %{http_code}\n" \
  | head -5

echo ""

# Test 5: Test login with new admin
echo "📝 Test 5: Login with new admin credentials"
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}' \
  -c cookies_new.txt \
  -s -o /dev/null -w "HTTP Status: %{http_code}\n"

echo ""

# Cleanup
echo "🧹 Cleaning up test files"
rm -f cookies.txt cookies_new.txt

echo "✅ Admin Management System Tests Complete!"
echo ""
echo "🔗 Manual Testing URLs:"
echo "   Login: http://localhost:3000/admin/login"
echo "   Admin Management: http://localhost:3000/admin/admins"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email: bimaldevasia@gmail.com"
echo "   Password: 12345678"
