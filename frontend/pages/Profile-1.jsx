import React, { useState } from 'react';
import { User, Package, Heart, CreditCard, Settings, LogOut } from 'lucide-react';

const tabs = [
  { name: 'Personal Info', icon: User },
  { name: 'Orders', icon: Package },
  { name: 'Wishlist', icon: Heart },
  { name: 'Payment Methods', icon: CreditCard },
  { name: 'Settings', icon: Settings }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Personal Info');

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    orders: [
      {
        id: '#ORD-123456',
        date: '2024-03-15',
        total: 299.97,
        status: 'Delivered',
        items: 3
      },
      {
        id: '#ORD-123457',
        date: '2024-03-10',
        total: 149.99,
        status: 'Processing',
        items: 1
      }
    ],
    wishlist: [
      {
        id: 1,
        name: 'Classic White Sneakers',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2012&q=80'
      },
      {
        id: 2,
        name: 'Leather Crossbody Bag',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
      }
    ],
    paymentMethods: [
      {
        id: 1,
        type: 'Visa',
        last4: '4242',
        expiry: '12/25'
      },
      {
        id: 2,
        type: 'Mastercard',
        last4: '8888',
        expiry: '09/24'
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === tab.name
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'Personal Info' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-6">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={user.address.street}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={user.address.city}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={user.address.state}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={user.address.zip}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={user.address.country}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Orders' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Order History</h3>
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{order.id}</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p>Items: {order.items}</p>
                        <p>Total: ${order.total.toFixed(2)}</p>
                      </div>
                      <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Wishlist' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">My Wishlist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user.wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-4 border border-gray-200 rounded-lg p-4 hover:border-gray-300"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        <div className="mt-2 space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Add to Cart
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Payment Methods' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Saved Payment Methods</h3>
                <div className="space-y-4">
                  {user.paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-gray-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-medium">
                          {method.type}
                        </div>
                        <div>
                          <p className="font-medium">•••• {method.last4}</p>
                          <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                  Add New Payment Method
                </button>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Email Notifications</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2">Order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2">Special offers and promotions</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">Newsletter</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Privacy</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2">Show my profile to other users</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          defaultChecked
                        />
                        <span className="ml-2">Allow search engines to index my profile</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                      Change Password
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;