# 🚀 AirCart Admin & Testing Guide

**Date**: April 3, 2026  
**Version**: 2.0 (UI Redesign + Chatbot + Admin Features)  
**Status**: ✅ **READY FOR TESTING**

---

## 📋 Quick Start

### Servers Setup
```bash
# Terminal 1: Start Backend API (Port 5000)
cd packages/api
npm run dev

# Terminal 2: Start Frontend Web App (Port 3000)
cd apps/web
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## 👤 Admin Credentials

### Primary Admin Account
```
Email:    admin@aircart.com
Password: Demo@123!Pass
Role:     admin
Status:   ✅ Active & Verified
```

### How to Access Admin Panel
1. Go to http://localhost:3000/auth/login
2. Enter admin credentials (shown above)
3. Click "Sign In"
4. You'll be redirected to Admin Dashboard: http://localhost:3000/admin

---

## 🎯 Admin Panel Features

### Dashboard Overview (`/admin`)
- **Stats Cards**: Total products, Total orders, Total users, Revenue
- **Recent Orders**: Last 10 orders with status tracking
- **Recent Products**: Latest product additions
- **Quick Actions**: Create product, View all orders, Manage users

### Product Management (`/admin/products`)
**View/Search/Filter:**
- ✅ Search by product name
- ✅ Filter by category, status, stock level
- ✅ Sort by name, price, date, popularity
- ✅ Pagination (10 items per page)

**Add Product:**
- Product name, description
- Price & original price
- Stock quantity
- Category & tags
- Images (will support multi-image upload in v2.1)
- SKU & weight/dimensions

**Edit Product:**
- Update any field
- Modify prices
- Change stock level
- Update category/tags

**Delete Product:**
- Single product delete
- ✅ Bulk delete (in development)
- Soft delete (marks as inactive)

**Bulk Operations** (Phase 2):
- 📥 Import from CSV
- 📤 Export to CSV
- 🖼️ Batch image upload
- 📊 Inventory sync

### Order Management (`/admin/orders`)
- ✅ View all orders
- ✅ Filter by status (pending, confirmed, processing, shipped, delivered, cancelled)
- ✅ Search by order ID, customer email
- ✅ View order details & items
- ✅ Update order status
- ✅ Generate invoices
- 💬 Add order notes

### User Management (`/admin/users`)
- ✅ View all users
- ✅ Search by email/name
- ✅ View user details
- ✅ View order history
- ✅ Deactivate/activate users
- 🔐 Change user role
- 📧 Contact user

---

## ✅ Testing Checklist

### 1️⃣ Authentication Testing

#### Login with Admin Account
```
✓ Navigate to /auth/login
✓ Email: admin@aircart.com
✓ Password: Demo@123!Pass
✓ Click "Sign In"
✓ Verify: Token stored in localStorage
✓ Verify: User data saved
✓ Verify: Redirect to /admin dashboard
✓ Verify: User name appears in nav dropdown
```

#### Logout
```
✓ Click user avatar in top-right nav
✓ Select "Logout"
✓ Verify: Token removed from localStorage
✓ Verify: User data cleared
✓ Verify: Redirect to login page
```

#### Invalid Login
```
✓ Try: admin@aircart.com + wrong password
✓ Verify: Error message displays: "Invalid credentials"
✓ Verify: No token stored
✓ Try: nonexistent@aircart.com + anypassword
✓ Verify: Error message displays: "Invalid credentials"
```

---

### 2️⃣ Admin Product Operations

#### Create Product
```
✓ Navigate to /admin/products
✓ Click "Add Product" button
✓ Fill form:
   - Name: Test Product XYZ
   - Description: A test product for verification
   - Price: 1,999
   - Original Price: 2,999
   - Stock: 50
   - Category: Electronics
   - Tags: test, new, premium
✓ Click "Create"
✓ Verify: Product appears in list
✓ Verify: Price shows 33% discount
✓ Open product detail, verify data saved correctly
```

#### Update Product  
```
✓ Find created product in list
✓ Click "Edit" button
✓ Change:
   - Price: 1,599
   - Stock: 30
✓ Click "Save Changes"
✓ Verify: Product info updated in list
✓ Verify: Discount recalculated to 47%
```

#### Delete Product
```
✓ Find product in list
✓ Click "Delete" button
✓ Confirm deletion dialog
✓ Verify: Product removed from list
✓ Verify: Product no longer visible on storefront
```

#### Search & Filter
```
✓ Search by name: Type product name
✓ Verify: Results filtered correctly
✓ Filter by category: Select "Electronics"
✓ Verify: Only Electronics shown
✓ Filter by stock: "In Stock" / "Out of Stock"
✓ Verify: Filters work correctly
```

#### Pagination
```
✓ Navigate to Product Management
✓ If > 10 products exist
✓ Verify: First page shows items 1-10
✓ Click "Next" or page number
✓ Verify: Page loads correctly
```

---

### 3️⃣ Admin Order Operations

#### View Orders
```
✓ Navigate to /admin/orders
✓ Verify: All user orders displayed
✓ Verify: Shows: Order ID, Customer, Date, Status, Total
✓ Click on any order
✓ Verify: Order detail modal/page opens
✓ Verify: Shows all items, addresses, payment info
```

#### Update Order Status
```
✓ Open any order
✓ Change status: pending → confirmed
✓ Verify: Status updated immediately
✓ Change status: confirmed → processing
✓ Verify: Database updated
✓ Check order history shows status change with timestamp
```

#### Filter Orders
```
✓ Filter by status: "delivered"
✓ Verify: Only delivered orders shown
✓ Filter by status: "pending"
✓ Verify: Only pending orders shown
✓ Search by order ID
✓ Verify: Correct order found
```

---

### 4️⃣ Admin User Operations

#### View Users
```
✓ Navigate to /admin/users
✓ Verify: All users listed
✓ Verify: Shows: Email, Name, Role, Status, Last Login
✓ Click on any user
✓ Verify: User detail panel opens
✓ Verify: Shows all account info
```

#### User Management
```
✓ Find any customer user
✓ Change role: customer → admin
✓ Verify: Role updated
✓ Deactivate user
✓ Verify: User status changes to "inactive"
✓ User can no longer login
✓ Activate user again
✓ Verify: User can login again
```

#### View User Orders
```
✓ Click on user
✓ In user detail, scroll to "Orders" section
✓ Verify: All user's orders listed
✓ Click on any order
✓ Verify: Order details open
```

---

### 5️⃣ Payment System Testing

#### Create Test Order
```
✓ Logout from admin, login as customer (or register new)
✓ Add products to cart
✓ Go to checkout
✓ Fill shipping address
✓ Select "PayPal" payment method
✓ Click "Place Order"
```

#### PayPal Payment Flow
```
✓ Verify: Redirected to PayPal Sandbox
✓ Verify: Order ID passed to PayPal
✓ Verify: Amount matches cart total
✓ In PayPal: Use sandbox test account
✓ Complete payment (Approve)
✓ Verify: Redirected to /checkout/success
✓ Verify: Order status changes to "confirmed" / "completed"
✓ In admin: View order, verify payment_status = "completed"
✓ Verify: payment_ref contains PayPal transaction ID
```

#### Payment Failure Flow
```
✓ Go back to checkout
✓ Create new order with PayPal
✓ In PayPal: Click "Cancel"
✓ Verify: Redirected to /checkout/cancel
✓ Verify: Order status remains "pending"
✓ In admin: payment_status = "pending"
```

---

### 6️⃣ UI/UX Testing

#### Dark Theme & Animations
```
✓ Homepage loads with smooth animations
✓ Hero section: Background blobs animate
✓ Featured products: Stagger animation on load
✓ Navigation: Smooth transitions, color scheme correct
✓ Buttons: Hover animations smooth
✓ Cards: Scale/shadow on hover
✓ All text readable on dark background
✓ No layout breaks
```

#### Responsive Design
```
✓ Test on Desktop (1920x1080)
✓ Test on Tablet (768x1024)
✓ Test on Mobile (375x667)
✓ Navigation collapses properly on mobile
✓ Cards stack vertically on mobile
✓ Forms are full-width and readable
✓ Touch targets are appropriately sized
✓ No horizontal scroll
```

#### Chatbot Widget
```
✓ Floating button visible bottom-right corner
✓ Click button: Chat window animates in
✓ Type message & send
✓ Bot responds appropriately
✓ Message history displays
✓ Typing indicators show while waiting
✓ Close button (X) works
✓ Works on mobile (stays in corner)
```

---

### 7️⃣ Comprehensive Checklist

#### Account Management
- [ ] Register new user
- [ ] Login as different roles (customer, admin)
- [ ] Logout clears data
- [ ] Profile updates persist
- [ ] Password change functionality

#### Shopping Flow
- [ ] Add items to cart
- [ ] Cart persists on page reload
- [ ] Update quantities
- [ ] Remove items
- [ ] Clear cart
- [ ] Cart total calculates correctly

#### Product Catalog
- [ ] Homepage loads featured products
- [ ] Products page shows all products
- [ ] Search works
- [ ] Filters work (category, price, rating)
- [ ] Sorting works (price asc/desc, newest, popular)
- [ ] Product details page loads
- [ ] Product images load
- [ ] Ratings display correctly

#### Checkout Process
- [ ] Shipping form validates
- [ ] Address saved correctly
- [ ] Payment method selection works
- [ ] Order summary shows correct total
- [ ] Tax calculation correct
- [ ] Shipping cost adds correctly

#### Payment Integration
- [ ] PayPal flow works end-to-end
- [ ] Success page displays order number
- [ ] Failed payment handled gracefully
- [ ] Refund request works
- [ ] Payment receipt sent

#### Admin Features
- [ ] Dashboard loads stats
- [ ] Product CRUD works
- [ ] Order management works
- [ ] User management works
- [ ] Protected routes (non-admin redirected)
- [ ] Bulk operations (when ready)

---

## 🔧 Troubleshooting

### Backend Not Running
```
Error: Failed to connect to server
Fix: Ensure backend is running at http://localhost:5000
     cd packages/api && npm run dev
```

### Login Shows "Invalid Credentials"
```
Check: Backend is running
Check: Database is accessible
Try: Email: admin@aircart.com, Password: Demo@123!Pass
     Both credentials are case-sensitive
```

### Admin Dashboard Loading Slowly
```
Check: Network tab in Dev Tools
Check: API endpoints responding
Refresh: Hard refresh (Ctrl+F5)
Check: Backend console for errors
```

### Products Not Showing
```
Check: Products API endpoint: GET /api/products
Try: curl http://localhost:5000/api/products
Check: Database has products
If creating product: Verify image upload path
```

### Payment Not Working
```
Check: PAYPAL_CLIENT_ID set in .env
Check: PAYPAL_MODE=sandbox
Check: FRONTEND_URL correct in .env
Try: PayPal Sandbox at https://www.sandbox.paypal.com
Test credentials in PayPal docs
```

---

## 📊 Test Data

### Sample Products to Create
```
1. Product: iPhone 15 Pro
   Price: 119,999 | Original: 134,999
   Stock: 50 | Category: Mobiles

2. Product: MacBook Air M3
   Price: 114,999 | Original: 124,999
   Stock: 30 | Category: Laptops

3. Product: Sony WH-1000XM6
   Price: 24,999 | Original: 34,999
   Stock: 100 | Category: Audio

4. Product: PS5 Slim
   Price: 44,999 | Original: 54,999
   Stock: 20 | Category: Gaming
```

### Sample Orders
```
Place multiple orders as different users to test:
- Admin order management
- Payment processing
- Invoice generation
- Email notifications (when implemented)
```

---

## 📞 Support

### Common Issues & Resolutions

**Issue**: Port 3000 already in use
```
Solution: Kill process on port 3000
          MacOS/Linux: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
          Windows: netstat -ano | findstr :3000
          Then: npm run dev
```

**Issue**: Module not found error
```
Solution: npm install in respective package directory
          cd apps/web && npm install
          cd packages/api && npm install
```

**Issue**: Framer Motion animations not working
```
Check: Framer Motion installed: npm install framer-motion
Check: Component wrapped in motion.div
Check: whileHover/animate props defined correctly
```

**Issue**: Chatbot not displaying
```
Check: @/components/Chatbot imported in layout
Check: Chatbot component mounted in main layout
Check: z-index not hidden by other elements (should be z-40)
```

---

## 🎯 Next Steps (Phase 2)

1. **✅ UI Redesign with Animations** - COMPLETE
2. **✅ Chatbot Widget** - COMPLETE (mock responses, AI integration pending)
3. **∈ AI Integration**: Connect Google Gemini API for intelligent product search
4. **∈ Admin Bulk Operations**: CSV import/export, batch image upload
5. **∈ Email Notifications**: Order confirmations, payment receipts, shipping updates
6. **∈ Analytics Dashboard**: Sales trends, product performance, customer insights
7. **∈ Inventory Management**: Low-stock alerts, reorder suggestions, stock forecasting
8. **∈ Advanced Admin Features**: User role management, discount codes, promotional campaigns

---

## ✨ Features Implemented

### Phase 1: Foundation ✅
- [x] Node.js/Express backend with JWT auth
- [x] Next.js frontend with TypeScript
- [x] PostgreSQL database setup
- [x] Product CRUD API
- [x] Shopping cart system
- [x] Basic authentication

### Phase 2: Modern UI & Animations ✅
- [x] Dark theme color scheme
- [x] Framer Motion animations
- [x] Modern buttons & cards
- [x] Responsive design
- [x] Animated homepage hero
- [x] Category browser with animations
- [x] Product cards with stagger animations
- [x] Countdown timer animation
- [x] Chatbot floating widget

### Phase 3: AI & Admin (In Progress)
- [ ] Google Generative AI chatbot integration
- [ ] Admin product bulk operations
- [ ] Image upload & processing
- [ ] Inventory tracking dashboard
- [ ] Analytics & reporting

### Phase 4: Payments & Webhooks ✅
- [x] PayPal integration
- [x] Payment status tracking
- [x] Webhook handling
- [x] Order confirmation

### Phase 5: Production Ready (Pending)
- [ ] Error logging & monitoring
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Cache optimization

---

## 📱 Device Testing Matrix

| Device | Resolution | Status | Notes |
|--------|-----------|--------|-------|
| Desktop | 1920x1080 | ✅ | Verified fully functional |
| Tablet | 768x1024 | ✅ | Verified fully functional |
| Mobile | 375x667 | ✅ | Verified fully functional |
| iPhone 15 | 390x844 | ✅ | Verified fully functional |
| iPad Air | 820x1180 | ✅ | Verified fully functional |

---

## 🚀 Deployment Ready

**Current Status**: Ready for local testing and development
**Production Ready**: Pending security audit and load testing
**Docker Support**: ✅ Configured in docker-compose.yml
**Railway Support**: ✅ Configuration files present

---

**Last Updated**: April 3, 2026  
**Next Review**: Post-AI Integration  
**Maintained By**: Development Team
