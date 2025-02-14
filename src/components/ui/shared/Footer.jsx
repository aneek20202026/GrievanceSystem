function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">
                We are committed to addressing and resolving grievances efficiently and fairly. Our goal is to improve
                services and maintain trust.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-sm">
                <li className="mb-2">
                  <a href="#" className="hover:text-blue-300">
                    Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-blue-300">
                    Submit Grievance
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-blue-300">
                    Track Grievance
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:text-blue-300">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm mb-2">Email: support@grievanceportal.com</p>
              <p className="text-sm mb-2">Phone: </p>
              <p className="text-sm">Address: 123 Grievance St, Resolution City, 12345</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2025 Grievance Management Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  