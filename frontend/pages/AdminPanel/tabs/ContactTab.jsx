import { useState, useEffect } from "react";
import axios from "axios";
import getContact from "../../../services/contact/getContact.js";
import SmallLoader from "../../../components/SmallLoader"
import updateContactService from "../../../services/contact/updateContactService.js";
export default function ContactTab() {
  const [contactInfo, setContactInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    area: "",
    city: "",
    country: "",
    postalCode: "",
    contactNo: "",
    email: "",
  });

  async function fetchContactData(){
    setIsLoading(true)
    const {data} = await getContact()
    // console.log(data[0])
    // here i will spread so i can access the data outside of address object
    const allContactData = {
      ...data[0],
      ...data[0].address
    }
    delete allContactData.address
    setContactInfo(allContactData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchContactData()
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({ ...prev, [name]: value }));
  };

   async function handleUpdate() {
    // console.log(contactFormData)
    setIsUpdating(true)
    const formData = new FormData()
    formData.append("email",contactFormData.email)
    formData.append("contactNo",contactFormData.contactNo)
    formData.append("area",contactFormData.area)
    formData.append("city",contactFormData.city)
    formData.append("country",contactFormData.country)
    formData.append("postalCode",contactFormData.postalCode)
    const data = await updateContactService(formData)
    // console.log(data)
    setIsUpdating(false)
    setIsEditing(false)
    fetchContactData()
  };

  const handleCancel = () => {
    setContactFormData(contactInfo);
    setIsEditing(false);
  };

  function handleEdit(contactData){
    setContactFormData(contactData)
    setIsEditing(true)
  }
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Contact Information
      </h2>

      {isEditing ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Area
              </label>
              <input
                type="text"
                name="area"
                value={contactFormData.area}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={contactFormData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={contactFormData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={contactFormData.postalCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="contactNo"
              value={contactFormData.contactNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={contactFormData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-200"
              onClick={handleUpdate}
            >
              {
                isUpdating?"Updating...":"Update"
              }
              
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition duration-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        isLoading ?<SmallLoader/> : (
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-medium text-gray-800">Address:</span>{" "}
              {`${contactInfo?.area}, ${contactInfo?.city}, ${contactInfo?.country} - ${contactInfo?.postalCode}`}
            </p>
            <p>
              <span className="font-medium text-gray-800">Phone:</span>{" "}
              {contactInfo?.contactNo}
            </p>
            <p>
              <span className="font-medium text-gray-800">Email:</span>{" "}
              {contactInfo?.email}
            </p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-200"
              onClick={() => handleEdit(contactInfo)}
            >
              Edit
            </button>
          </div>
        )
      )}
    </div>
  );
}
