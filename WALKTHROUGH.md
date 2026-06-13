# ShopWave v2 - Complete Feature Walkthrough

Welcome to ShopWave v2! This guide covers every feature and will help you explore and understand the application.

---

## 📋 Quick Navigation

### Getting Started
- [Prerequisites & Setup](#prerequisites--setup)
- [Quick Start](#quick-start)

### Core Features
- [Homepage](#homepage)
- [Navigation & Global Components](#navigation--global-components)
- [Shop Page](#shop-page)
- [Cart Page](#cart-page)
- [Profile & Order Tracking](#profile--order-tracking)

### Design & UX
- [Theme & Design](#theme--design)
- [Animations & Interactions](#animations--interactions)
- [Toast Notifications](#toast-notifications)

### Testing & Learning
- [Responsive Design Testing](#responsive-design-testing)
- [Advanced Features](#advanced-features)
- [Technology Stack](#technology-stack)
- [Verification Checklist](#verification-checklist)

---

## Prerequisites & Setup

### Requirements
- Node.js installed on your system
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Quick Start

1. **Navigate to the project directory**:
   ```bash
   cd /path/to/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The app will be available at `http://localhost:5173/`
   - You should see the ShopWave homepage load immediately

---

## Homepage

The homepage showcases all the key features and brand story.

### 1. Hero Carousel

**What to Look For:**
- Full-screen banner with background image
- "FEATURED COLLECTION" label with headline
- Subtitle text and "SHOP NOW" call-to-action button
- Navigation arrows (left/right) and dot indicators (4 dots for 4 slides)

**How to Interact:**
1. Watch auto-rotation — slides change every 2 seconds
2. Click left/right arrows to navigate manually
3. Click any dot to jump directly to that slide
4. Observe smooth fade transitions and text animations
5. Click "SHOP NOW" to navigate to Shop page

**Behind the Scenes:**
- Framer Motion creates smooth animations
- Auto-rotation uses a 2-second interval
- Each slide has unique content (title, subtitle, image, button)
- Staggered animations for visual appeal

---

### 2. Featured Categories Section

**What to Look For:**
- Three category cards below hero carousel
- Cards: "Couture", "Accessories", "The Modern Gentleman"
- Each card has a "DISCOVER" or "EXPLORE ESSENTIALS" link

**How to Interact:**
1. Hover over cards to see subtle hover effects
2. Click any card to navigate to the Shop page (filtered by category if implemented)
3. Observe high-quality fashion photography

---

### 3. Brand Story Section

**What to Look For:**
- "OUR STORY" label in purple
- Large heading: "The Digital Atelier"
- Descriptive paragraph about the brand
- Light background with professional typography

**Content Highlights:**
- Explains brand mission: craftsmanship, minimalism, modern design
- Builds trust through storytelling
- Emphasizes quality and sustainability

**How to Interact:**
1. Read the story to understand brand values
2. Notice fade-in animation as you scroll
3. Observe professional font hierarchy and sizing

---

### 4. Best Sellers Grid

**What to Look For:**
- "CURATED SELECTION" section with "The Best Sellers"
- Grid of 8 product cards
- Each card shows: image, name, star rating, price, action buttons
- "LOAD MORE PIECES" button at the bottom

**How to Interact:**
1. Hover over a product card to see interactive buttons
2. Click product image to navigate to product detail page
3. Click "Add to Cart" to add product (see toast notification)
4. Click heart icon to add to wishlist
5. Products fade in smoothly as you scroll
6. Click "LOAD MORE PIECES" to load additional products

**What's Happening:**
- Products are lazy-loaded for performance
- Skeleton loaders appear while loading
- Smooth entrance animations with Framer Motion
- Toast notifications confirm actions

---

### 5. Customer Testimonials Section

**What to Look For:**
- "CUSTOMER REVIEWS" section with 4 testimonial cards
- Each card shows: 5-star rating, customer quote, avatar, name, role
- White background with subtle shadows

**Included Testimonials:**
1. **Sarah Johnson** (Fashion Enthusiast) — quality and confidence
2. **Michael Chen** (Style Consultant) — transformation and mastery
3. **Emma Davis** (Creative Director) — craftsmanship and detail
4. **James Wilson** (Entrepreneur) — lifestyle and brand vision

**How to Interact:**
1. Read testimonials to understand customer satisfaction
2. Notice staggered appearance animation as you scroll
3. Observe high-quality avatar images for credibility

**Why This Matters:**
- Social proof builds trust with potential customers
- Diverse profiles show broad appeal
- Professional presentation increases credibility

---

### 6. Partner Brands Showcase

**What to Look For:**
- "TRUSTED PARTNERS" section with 6 brand cards
- 2 columns on mobile, 3 on tablet, 6 on desktop
- Each card has emoji logo, brand name, and hover effects

**How to Interact:**
1. Hover over a brand card to see border color change (#2a14b4)
2. Notice card lifts with shadow effect
3. Watch cards scale up smoothly as you scroll
4. Cards rearrange based on screen size

**Design Features:**
- Hover effects: border color change, shadow elevation, upward movement
- Smooth transitions for all states
- Responsive grid that adapts to screen size

---

### 7. Newsletter Subscription

**What to Look For:**
- Large blue section at bottom of homepage
- "Subscribe to Our Newsletter" heading
- Email input field with placeholder text
- "Subscribe" button

**How to Interact:**
1. Click email input field to focus
2. Type an email address (e.g., "test@example.com")
3. Click Subscribe button to submit
4. Try invalid email like "notanemail" and observe validation
5. Valid email clears after successful submission

**Email Validation:**
- Uses regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Requires: characters, @, more characters, dot, domain
- Visual feedback for invalid entries

---

## Navigation & Global Components

These components appear on every page and help you navigate the app.

### 1. Announcement Bar

**What to Look For:**
- Thin bar at the very top of every page
- Scrolling promotional text moving left to right
- Continuous marquee animation

**How to Interact:**
1. Hover over announcement bar to pause scrolling
2. Move mouse away to resume scrolling
3. Observe smooth marquee animation

**Typical Message:**
- "Welcome to ATELIER - Discover Premium Fashion | Free Shipping on Orders Over $150 | New Collection Available Now!"

---

### 2. Enhanced Navbar

**Layout:**
- Left side: "ATELIER" logo/brand name
- Center: Search bar with magnifying glass icon
- Right side: Wishlist, cart (with badge), theme toggle, user profile icons

#### Live Search Functionality

1. Click the search bar to activate
2. Start typing a product name (e.g., "shirt")
3. Dropdown shows top 3 matching products with:
   - Product image thumbnail
   - Product name
   - Product price
4. Click a product to navigate to its detail page
5. Press Enter or click outside to close dropdown

#### Navbar Icons

| Icon | Function | Behavior |
|------|----------|----------|
| 🔍 | Search | Shows live search dropdown |
| ❤️ | Wishlist | Navigates to wishlist page |
| 🛒 | Cart | Shows item count badge + total price |
| 🌙/☀️ | Theme | Toggles dark/light mode |
| 👤 | Profile | Shows when logged in |

**Responsive Behavior:**
- Mobile: Some icons hidden, search may collapse
- Tablet: All icons visible
- Desktop: Full navbar with all features

---

### 3. Breadcrumb Navigation

**What to Look For:**
- Appears on all internal pages (not on homepage)
- Shows your location in app hierarchy
- Format: "HOME > SHOP > PRODUCT NAME"
- Each part is clickable

**Examples:**
- Shop page: `HOME > SHOP`
- Product detail: `HOME > SHOP > PRODUCT NAME`
- Cart page: `HOME > SHOP > CART`
- Profile page: `HOME > PROFILE`

**How to Use:**
1. Click any breadcrumb part to navigate there
2. Use for quick navigation between sections
3. Always know your location in the app

---

### 4. Scroll-to-Top Button

**What to Look For:**
- Floating button in bottom-right corner
- Appears only after scrolling down 300 pixels
- Has upward arrow icon
- Semi-transparent with hover effects

**How to Interact:**
1. Scroll down the page 300px+
2. Button fades in smoothly
3. Hover to see color change and elevation
4. Click to smoothly scroll back to top
5. Button disappears as you scroll back up

**Why It's Useful:**
- Quick navigation for long pages
- Improved mobile experience
- Polished smooth animation

---

### 5. Professional Footer

**Layout:**
- Multiple columns with information
- Dark background with light text
- Sections for newsletter, brand info, links, and payment methods

#### Newsletter Subscription (Top)
- Blue background section
- Email input field
- Subscribe button
- Promotional text

#### Brand Information (Left Column)
- "ATELIER" brand name
- Brand description
- Contact information:
  - Email: ahmed@example.com
  - Phone: +1 (555) 123-4567
- Social media links (GitHub, Twitter, Facebook, Instagram, Google)

**Social Links Behavior:**
1. Hover over icons to see color change and lift effect
2. Click to open in new tab
3. Circular buttons with primary color on hover

#### Footer Links (Right Columns)

| Category | Links |
|----------|-------|
| SHOP | New Arrivals, Best Sellers, Sale, Collections |
| COMPANY | About Us, Our Story, Careers, Press |
| SUPPORT | Contact, Shipping Info, Returns, FAQ |
| LEGAL | Privacy Policy, Terms & Conditions, Cookie Policy, Disclaimer |

**How to Interact:**
1. Hover over any link for color change to primary color
2. Click to navigate (if page implemented)
3. Consistent typography and spacing throughout

#### Payment Methods & Copyright
- Display of accepted payment methods: Visa, Mastercard, PayPal, Apple Pay, Google Pay
- Year-based copyright notice
- Designer attribution: "Designed by Ahmed Salah"
- Updates automatically each year

---

## Shop Page

The Shop page lets you browse and filter products with advanced options.

### Accessing the Shop Page

**How to Get There:**
1. Click "SHOP" in navbar, OR
2. Click "SHOP NOW" or "EXPLORE" button on homepage, OR
3. Click breadcrumb "SHOP" link, OR
4. Navigate directly to `/shop`

**Layout:**
- Two-column design: Filters on left, products on right
- Page title: "Collection"
- Product count: "Showing X curated pieces in the digital atelier"
- Sort dropdown on the right

---

### Filter Sidebar (Left Column)

**Sticky Positioning:**
- Sidebar stays visible as you scroll down
- Maintains position at viewport top
- Convenient for filtering while browsing

#### Search Filter
1. Find "SEARCH PIECES" section at top
2. Click search input and type product name
3. Real-time filtering as you type
4. Example searches: "shirt", "jacket", "dress", "shoes"

#### Category Filter
1. Find "CATEGORIES" section
2. Dynamically loaded categories from products
3. Click checkbox to select/deselect category
4. Multiple selection allowed
5. Selected categories appear bold with primary color
6. "Clear Filters" button appears when categories selected
7. Click to reset all selections

**Example Categories:**
- electronics
- jewelery
- men's clothing
- women's clothing

#### Price Range Filter
1. Find "PRICE RANGE" section with slider
2. Ranges from $0 to $1000
3. Drag slider left to decrease max price, right to increase
4. Current max price displays on right
5. Real-time filtering as you adjust
6. Try different ranges: $0-$100, $100-$500, $500-$1000

#### Exclusive Membership Card
1. Find blue card at bottom of sidebar
2. "EXCLUSIVE" label with "Unlock the Archive" heading
3. Description of membership benefits
4. "JOIN NOW" call-to-action button
5. Encourages user engagement

---

### Product Grid (Right Column)

#### Grid Header
- Title: "Collection"
- Subtitle with product count
- "Sort By" dropdown for sorting options

#### Sorting Options

1. Default — Original order
2. Price: Low to High — Cheapest first
3. Price: High to Low — Most expensive first
4. Name: A-Z — Alphabetical order
5. Products rearrange immediately

#### Product Cards
- **Grid layout:** 1 column on mobile, 2 on tablet, 3 on desktop
- **Each card shows:**
  - Product image
  - Product name
  - Star rating
  - Number of reviews
  - Price
  - "Add to Cart" and "Add to Wishlist" buttons

**Card Interactions:**
1. Hover to see interactive buttons
2. Click image to navigate to product detail
3. Click "Add to Cart" for success toast
4. Click heart icon to add to wishlist
5. Products fade in smoothly as they appear

#### Empty State
- Shows sad face icon when no products match
- Message: "The archive is empty"
- Subtitle: "No pieces match your current criteria"
- "Reset Filters" button to clear filters

---

### Filtering Workflow Example

**Scenario: Find affordable women's clothing**

1. Start on Shop page to see all products
2. Find Categories section and click "women's clothing"
3. Observe products filter to show women's items only
4. Drag Price Range slider to set max at $50
5. See only affordable women's clothing
6. Try sorting: Click "Price: Low to High"
7. Use search and type "shirt" to narrow further
8. Click "Clear Filters" to reset everything

---

## Cart Page

The Cart page lets you review items, apply discounts, and proceed to checkout.

### Accessing the Cart Page

**How to Get There:**
1. Click cart icon in navbar, OR
2. Navigate to `/cart`, OR
3. Click "GO TO CART" after adding items

**Layout:**
- Two-column design: Cart items on left, Order Summary on right
- Empty cart shows friendly message with "GO TO SHOP" button

---

### Cart Items Section

#### Adding Items
1. Go to Shop page
2. Click "Add to Cart" on several items
3. Return to Cart via navbar icon
4. See all added products

#### Cart Item Display
Each item shows:
- Product image thumbnail
- Product name
- Product price (per unit)
- Category information
- Quantity control
- Total price for that item
- Remove button (X icon)

#### Quantity Control
1. Find quantity control showing current quantity
2. Click + button to increase quantity
3. Click - button to decrease quantity
4. Type in field to enter specific quantity
5. Total price updates automatically

#### Removing Items
1. Find X button on right side of each item
2. Hover to see red color
3. Click to remove item
4. Item fades out smoothly

#### Item Animations
- Items fade in smoothly when cart loads
- Smooth transitions when quantities change
- Smooth fade-out when items removed

---

### Promo Code Section

**Location:** Below cart items

**How to Use:**
1. Find "Have a Promo Code?" section (blue background)
2. See input field with placeholder: "Enter promo code (SAVE10 or SAVE20)"
3. Type a promo code:
   - `SAVE10` = 10% discount
   - `SAVE20` = 20% discount
   - Other codes = no discount
4. Click "Apply" button
5. See result:
   - Valid code: "✓ Discount applied: $XX.XX"
   - Invalid code: No discount message
6. Check Order Summary for discount

**Example Workflow:**
- Cart subtotal: $100
- Apply code "SAVE10"
- Discount: -$10
- New subtotal: $90

---

### Sticky Order Summary (Right Column)

**Key Feature: Sticky Positioning**
- Order Summary stays visible as you scroll down
- Very convenient for reviewing totals while browsing
- Remains at viewport top

#### Order Summary Breakdown

| Item | Description | Example |
|------|-------------|---------|
| Subtotal | Sum of all items | $249.99 |
| Discount | Applied promo code | -$25.00 |
| Shipping | Delivery cost | FREE (or $9.99) |
| Tax | 8% sales tax | $18.40 |
| **Total** | **Final amount** | **$243.39** |

#### Shipping Rules
- **FREE shipping:** Orders over $150
- **$9.99 shipping:** Orders under $150
- **Displays dynamically:** Changes as you add/remove items

#### Tax Calculation
- **Rate:** 8% of subtotal (after discount)
- **Automatic:** Calculated in real-time
- **Included in total:** Already added to final amount

#### Terms & Conditions
1. Find checkbox below totals
2. Read label: "I agree to the Terms & Conditions"
3. Check box to enable checkout button
4. Uncheck to disable checkout button

#### Checkout Button
1. Find "PROCEED TO CHECKOUT" button (large blue)
2. Disabled state: Until T&C is checked
3. Enabled state: Blue and clickable when T&C checked
4. Click to proceed to checkout page

#### Security Badge
- Lock icon with text: "Secure checkout with end-to-end encryption"
- Builds customer trust
- Appears at bottom of Order Summary

---

### Cart Workflow Example

**Complete Shopping Journey:**

1. Start on homepage and browse featured products
2. Add 3-4 items to cart via "Add to Cart" buttons
3. Click cart icon in navbar to go to Cart page
4. Review all items with quantities and prices
5. Adjust quantity on one item
6. Remove one product via X button
7. Apply promo code "SAVE10" and click Apply
8. Review Order Summary:
   - Subtotal
   - Discount applied
   - Shipping cost (free or $9.99)
   - Tax calculation
   - Final total
9. Check Terms & Conditions checkbox
10. Click "PROCEED TO CHECKOUT"

---

## Profile & Order Tracking

The Profile page shows your account info, order history, and advanced order tracking with a GIS-powered delivery map.

### Accessing the Profile Page

**How to Get There:**
1. Click user icon in navbar (if logged in), OR
2. Navigate directly to `/profile`, OR
3. Use profile link in navbar

**If Not Logged In:**
- See message: "Please log in to view your profile"
- "Go to Login" button to navigate to login page

---

### Profile Information Card (Left Sidebar)

#### User Avatar
- Large circular avatar with user initials
- Background color: Primary color (#2a14b4)
- Size: 100x100 pixels
- Shows first letter of user's name

#### User Details
- **Name:** Displayed prominently
- **Email:** Shown below name
- **Contact Information:**
  - Email address with icon
  - Phone number with icon
  - Location with icon

#### Profile Actions
1. **Edit Profile button:** Opens editing interface (if implemented)
2. **Logout button:**
   - Click to logout
   - Redirects to homepage
   - Clears user session

---

### Order History Section

#### Order List
- Title: "Order History"
- Multiple order cards representing past orders
- Responsive layout: Stacks on mobile, side-by-side on desktop

#### Order Card Display
Each card shows:
- **Order ID:** Unique identifier (e.g., "ORD-001")
- **Order Date:** When order was placed
- **Item Count:** Number of items in order
- **Total Amount:** Order total price
- **Status Badge:** Color-coded status

#### Order Card Interactions
1. Click any order card to select for tracking
2. Selected order shows blue border
3. Card lifts on hover with shadow
4. Status colors:
   - Green: Delivered ✓
   - Blue: Shipped 🚚
   - Orange: Processing ⏳

#### Mock Orders Included

**ORD-001** (Delivered)
- Date: 2024-03-15
- Total: $249.99
- Items: 3
- Status: Delivered

**ORD-002** (Shipped)
- Date: 2024-03-22
- Total: $159.99
- Items: 2
- Status: Shipped

**ORD-003** (Processing)
- Date: 2024-03-25
- Total: $89.99
- Items: 1
- Status: Processing

---

### Order Progress Tracker

#### MUI Stepper Component
- Visual representation of all order stages
- 4 stages:
  1. Order Placed
  2. Processing
  3. Shipped
  4. Delivered

#### Stage Display
- **Completed stages:** Checkmark icon, filled circle
- **Current stage:** Highlighted, active indicator
- **Future stages:** Empty circle, not completed
- **Timestamps:** Date shown for each completed stage

#### Examples

**Delivered Order (ORD-001):**
```
✓ Order Placed (2024-03-15)
✓ Processing (2024-03-16)
✓ Shipped (2024-03-17)
✓ Delivered (2024-03-20)
```

**Shipped Order (ORD-002):**
```
✓ Order Placed (2024-03-22)
✓ Processing (2024-03-23)
✓ Shipped (2024-03-24)
○ Delivered (pending)
```

**Processing Order (ORD-003):**
```
✓ Order Placed (2024-03-25)
✓ Processing (2024-03-25)
○ Shipped (pending)
○ Delivered (pending)
```

---

### GIS Order Tracking Map ⭐

**This is the Signature Feature!**

#### Visual Delivery Route
Simple delivery visualization showing the path from warehouse to your address:

```
📦 Warehouse (NY) ———————→ 🏠 Your Address
```

#### Map Components
1. **Starting Point:** Warehouse (NY)
2. **Ending Point:** Your Address
3. **Progress Line:** Animated line connecting the two
4. **Status Indicator:** Shows current delivery status

#### Status Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Delivered | ✓ | Green | Order arrived |
| In Transit | 🚚 | Blue | On the way |
| Being Prepared | ⏳ | Orange | Preparing to ship |

#### Tracking Information
Below map visualization:

| Field | Content |
|-------|---------|
| Tracking Number | TRK123456789 (unique per order) |
| From | Warehouse (NY) |
| To | Your Address |

#### Animated Progress
- **Delivered orders:** Progress line fills left to right
- **Animation duration:** 2 seconds
- **Easing:** Linear for realistic effect
- **Completion:** Shows "Delivered Successfully" chip

#### How to Interact
1. Select different orders by clicking order cards
2. Watch progress line animate for each order
3. See status indicator update based on order status
4. Read From/To information

#### Workflow Example

**Click ORD-001 (Delivered):**
- Progress line fills completely
- Shows "✓ Delivered Successfully"
- All stages completed in stepper

**Click ORD-002 (Shipped):**
- Progress line partially filled
- Shows "🚚 In Transit"
- Shipped stage highlighted in stepper

**Click ORD-003 (Processing):**
- Progress line mostly empty
- Shows "⏳ Being Prepared"
- Processing stage highlighted in stepper

---

### Profile Page Workflow Example

**Complete Profile Journey:**

1. Navigate to profile via user icon in navbar
2. See your information: Avatar, name, email, contact details
3. View order history with all your orders
4. Select "ORD-001" (delivered order)
5. See progress tracker with all 4 stages completed
6. View delivery map showing warehouse to home route
7. Check tracking number: TRK123456789
8. Select "ORD-002" (shipped order)
9. See updated tracker with only 3 stages completed
10. See updated map with partially filled progress line
11. Check status: "In Transit" indicator shows
12. Select "ORD-003" (processing order)
13. See early stage with only 2 stages completed
14. See map with mostly empty progress line
15. See status: "Being Prepared" indicator shows
16. Click "Edit Profile" button (if implemented)
17. Click "Logout" button to exit

---

## Theme & Design

### 1. Dark Mode Toggle

**How to Access:**
1. Find theme icon in navbar: Moon (🌙) or Sun (☀️)
2. Click to toggle between dark and light mode
3. Entire app theme changes instantly

#### Light Mode
- Light backgrounds
- Dark text
- Bright colors
- Good for daytime use

#### Dark Mode
- Dark backgrounds
- Light text
- Adjusted colors for contrast
- Good for nighttime use

#### Persistence
- Your theme choice is saved to localStorage
- Persists across sessions
- Per-device setting (each device can differ)

---

### 2. Color Palette

#### Primary Color
- **Hex:** #2a14b4 (Deep Blue)
- **Usage:** Buttons, links, highlights, accents
- **Hover state:** Slightly lighter shade

#### Semantic Colors
- **Success:** Green (positive actions)
- **Error:** Red (destructive actions)
- **Warning:** Orange (caution)
- **Info:** Blue (informational messages)

#### Text Colors
- **Primary text:** Dark in light mode, light in dark mode
- **Secondary text:** Muted gray
- **Disabled text:** Very light gray

---

### 3. Typography

#### Font Family
- **Sans-serif:** Professional, modern look
- **Google Fonts:** Imported for consistency

#### Font Sizes
- **H1 (Headlines):** 3-5rem (large and bold)
- **H2-H3:** 1.5-2.5rem (section headers)
- **Body:** 1rem (standard reading)
- **Caption:** 0.75-0.85rem (small text)

#### Font Weights
- **900:** Extra bold (headings, CTAs)
- **800:** Bold (section titles)
- **700:** Semi-bold (emphasis)
- **600:** Medium (secondary text)
- **400:** Regular (body text)

---

### 4. Spacing & Layout

#### Spacing Scale
- **4px:** Minimal spacing
- **8px:** Small spacing
- **16px:** Standard spacing
- **24px:** Large spacing
- **32px:** Extra large spacing

#### Container Widths
- **Mobile:** Full width with padding
- **Tablet:** 90% width
- **Desktop:** 1200px max-width centered

#### Responsive Breakpoints
- **xs:** 0px (mobile phones)
- **sm:** 600px (small tablets)
- **md:** 960px (tablets)
- **lg:** 1280px (small desktops)
- **xl:** 1920px (large desktops)

---

## Animations & Interactions

### 1. Framer Motion Animations

#### Fade Animations
- **Entrance:** Elements fade in smoothly
- **Exit:** Elements fade out smoothly
- **Duration:** 0.3-0.5 seconds typically

#### Slide Animations
- **Hero carousel:** Text slides up with fade
- **Testimonials:** Cards slide in from bottom
- **Products:** Items slide up as they appear

#### Scale Animations
- **Hover effects:** Buttons and cards scale up slightly
- **Click feedback:** Elements scale down then back up
- **Loading states:** Skeleton loaders pulse

#### Stagger Effects
- **Multiple items:** Each item animates with slight delay
- **Creates flow:** Smooth sequential animation
- **Example:** Products animate one after another

---

### 2. Interactive Elements

#### Buttons
- **Hover:** Color change, slight elevation
- **Active:** Pressed appearance
- **Disabled:** Grayed out, no interaction

#### Cards
- **Hover:** Shadow increase, slight lift
- **Click:** Visual feedback
- **Transitions:** Smooth color and shadow changes

#### Input Fields
- **Focus:** Border color change, shadow
- **Error:** Red border, error message
- **Valid:** Green checkmark or success state

#### Icons
- **Hover:** Color change, scale effect
- **Animated:** Some icons animate on interaction
- **Tooltips:** Hover to see descriptions

---

## Toast Notifications

### What Are Toasts?

Small pop-up messages that appear briefly to confirm actions or show status updates.

### When Toasts Appear

| Action | Toast Message | Type |
|--------|---------------|------|
| Add to cart | "Added to cart!" | Success (green) |
| Add to wishlist | "Added to wishlist!" | Info (blue) |
| Remove from cart | "Removed from cart!" | Info (blue) |
| Apply promo code | "Discount applied!" | Success (green) |
| Invalid email | "Please enter a valid email" | Error (red) |

### Toast Behavior

- **Position:** Bottom-right corner of screen
- **Duration:** 4 seconds (auto-dismiss)
- **Stacking:** Multiple toasts stack vertically
- **Animation:** Fade in and out smoothly
- **Dismissable:** Click the X to close manually

### How to Trigger Toasts

1. **Add to cart:** Go to Shop, click "Add to Cart"
2. **Add to wishlist:** Click heart icon on product
3. **Subscribe:** Enter email in newsletter and click Subscribe
4. **Invalid email:** Try entering "notanemail" in newsletter
5. **Apply promo:** Go to Cart, enter "SAVE10", click Apply

---

## Responsive Design Testing

### Testing on Different Screen Sizes

#### Mobile (320px - 600px)
1. Open browser DevTools: F12 or Right-click > Inspect
2. Click device toolbar icon
3. Select mobile device: iPhone 12, Pixel 5, etc.
4. Observe changes:
   - Single column layouts
   - Larger touch targets
   - Hamburger menu (if implemented)
   - Stacked navigation

#### Tablet (600px - 960px)
1. Select tablet device: iPad, Tab S6, etc.
2. Observe changes:
   - 2-column layouts
   - Larger cards
   - More comfortable spacing
   - Sidebar visible

#### Desktop (960px+)
1. Select desktop: Desktop 1920x1080, etc.
2. Observe changes:
   - Full layouts
   - 3-column grids
   - All features visible
   - Optimal spacing

### Testing Orientation

1. **Portrait:** Vertical orientation (default)
2. **Landscape:** Horizontal orientation
3. Observe layout adjustment for each orientation

---

## Advanced Features

### Product Detail Page

**How to Access:**
1. Click any product image or name
2. See full product details
3. Larger image, full description
4. Reviews section
5. Related products

### Wishlist Page

**How to Access:**
1. Click heart icon on products
2. Click wishlist icon in navbar
3. See all saved items
4. Remove from wishlist
5. Move to cart

### Checkout Page

**How to Access:**
1. Go to cart
2. Click "PROCEED TO CHECKOUT"
3. Enter shipping information
4. Enter payment details
5. Complete order

### Login Page

**How to Access:**
1. Click user icon (when not logged in)
2. Or navigate to `/login`
3. Enter email
4. Login to access profile

---

## Technology Stack

| Technology | Purpose | Learn More |
|------------|---------|------------|
| React 19 | UI framework | reactjs.org |
| Material-UI | Component library | mui.com |
| Framer Motion | Animations | framer.com/motion |
| React Router | Navigation | reactrouter.com |
| Tailwind CSS | Styling | tailwindcss.com |
| Vite | Build tool | vitejs.dev |

### Code Structure
- **Components:** Reusable UI pieces
- **Pages:** Full page components
- **Context:** State management
- **Hooks:** Custom logic
- **Services:** API calls

### Best Practices
- Component composition: Break into smaller pieces
- Props drilling: Pass data through props
- State management: Use Context for global state
- Performance: Memoize expensive computations
- Accessibility: Include ARIA labels

---

## Common User Scenarios

### Scenario 1: New Visitor Browsing
1. Land on homepage
2. See hero carousel
3. Read brand story
4. Browse testimonials
5. Check partner brands
6. Click "SHOP NOW"

### Scenario 2: Returning Customer Shopping
1. Login to profile
2. Check order history
3. Browse shop with filters
4. Add items to cart
5. Apply promo code
6. Proceed to checkout

### Scenario 3: Order Tracking
1. Login to profile
2. View order history
3. Select recent order
4. Check progress tracker
5. View delivery map
6. See tracking number

### Scenario 4: Mobile Shopping
1. Open on phone
2. Browse responsive layout
3. Use mobile-optimized search
4. Tap to add to cart
5. View cart on mobile
6. Proceed to checkout

---

## Verification Checklist

Use this checklist to verify all features are working:

- [ ] Hero carousel auto-rotates every 2 seconds
- [ ] Navigation arrows work on carousel
- [ ] Dot indicators are clickable
- [ ] Live search shows top 3 products
- [ ] Breadcrumbs appear on all pages
- [ ] Scroll-to-top button appears after 300px
- [ ] Dark mode toggle works
- [ ] Theme preference persists
- [ ] Newsletter validation works
- [ ] Promo codes apply discounts
- [ ] Cart sticky summary stays visible
- [ ] Order tracker shows all stages
- [ ] Delivery map animates
- [ ] Testimonials load smoothly
- [ ] Partner brands hover effects work
- [ ] Product filtering works
- [ ] Sorting options work
- [ ] Responsive design works on mobile
- [ ] Toast notifications appear
- [ ] Footer links are clickable

---

## Keyboard Shortcuts & Tips

### Keyboard Navigation
- **Tab:** Navigate through interactive elements
- **Enter:** Activate buttons and links
- **Escape:** Close dropdowns and modals
- **Space:** Toggle checkboxes

### Browser DevTools Tips
- **Inspect Element:** Right-click any element
- **Network tab:** See API calls
- **Console:** Check for errors
- **Responsive Design Mode:** Test different sizes

### Performance Tips
- **Lazy loading:** Images load as needed
- **Smooth scrolling:** Use smooth scroll behavior
- **Caching:** Repeat visits are faster
- **Minified assets:** Smaller file sizes

### Accessibility Features
- **Keyboard navigation:** Full keyboard support
- **Focus indicators:** Clear focus rings
- **Color contrast:** Readable text
- **Alt text:** Images have descriptions

---

## Summary

You've now explored all major features of ShopWave v2! The application demonstrates modern e-commerce best practices with:

✨ **Beautiful Design** — Professional UI with smooth animations  
🛍️ **Complete Shopping Experience** — Browse, filter, cart, checkout  
📍 **Advanced Order Tracking** — Progress tracker with GIS map  
📱 **Responsive Design** — Works perfectly on all devices  
🌙 **Dark Mode Support** — Comfortable viewing in any lighting  
⚡ **Smooth Interactions** — Framer Motion animations throughout  
🎯 **Professional Polish** — Attention to detail in every component  

---

**For questions or feedback, contact: ahmedsaleh219013@gmail.com**
