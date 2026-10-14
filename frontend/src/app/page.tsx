'use client';

import Navigation from './components/Navigation';
import Carousel from './components/Carousel';
import ServiceCalendar from './components/ServiceCalendar';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-4xl text-black tracking-tight transition-all duration-500 ease-in-out">
            Welcome to CTJFI!
          </h1>
          
          <p className="text-base text-black max-w-xl font-light mx-auto leading-relaxed transition-all duration-500 ease-in-out">
            We are a family-oriented community committed to serving God and each other. Join us as we worship together and grow in our relationship with Christ.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#location"
              className="px-8 py-3 bg-blue-500 font-light text-white hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 ease-in-out rounded-lg hover:scale-105 active:scale-95 text-sm"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('location')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Visit Us
            </a>
            <a 
              href="https://www.youtube.com/@ctjfichurch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white font-light text-blue-700 active:bg-blue-200 transition-all duration-300 ease-in-out rounded-lg hover:scale-105 active:scale-95 text-sm"
            >
              Watch Livestream &gt;
            </a>
          </div>

          <div className="pt-8 w-full">
            <Carousel />
          </div>
        </div>
        
        <div className="mt-32 font-light max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 bg-white cursor-default rounded-lg">
            <h3 className="text-lg font-normal mb-4 text-black transition-colors duration-300">Our Mission</h3>
            <p className="text-gray-600 text-sm transition-colors duration-300">
              To spread the love of Christ and serve our community with compassion and grace.
            </p>
          </div>
          
          <div className="p-8 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 bg-white cursor-default rounded-lg">
            <h3 className="text-lg font-normal mb-4 text-black transition-colors duration-300">Community</h3>
            <p className="text-gray-600 text-sm transition-colors duration-300">
              Building meaningful relationships and supporting one another in faith.
            </p>
          </div>
          
          <div className="p-8 text-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 bg-white cursor-default rounded-lg">
            <h3 className="text-lg font-normal mb-4 text-black transition-colors duration-300">Worship</h3>
            <p className="text-gray-600 text-sm transition-colors duration-300">
              Gathering together to praise God and grow deeper in our spiritual journey.
            </p>
          </div>
        </div>

        <div id="location" className="mt-32 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-normal text-black mb-4">Visit Us</h2>
            <p className="text-gray-600 font-light">Join us for worship and fellowship</p>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden p-8 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 cursor-default">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left space-y-4">
                <div>
                  <p className="text-gray-700 font-normal mb-6">Chemin Rieu 3,<br></br>1208 Geneva, Switzerland</p>
                </div>
                
                <div>
                  <p className="text-gray-700 font-normal mb-1">Via TPG</p>
                  <p className="text-gray-500 text-sm font-light">Bus stop: Rieu, line 5, 11 and 25</p>
                  <p className="text-gray-500 text-sm font-light">Tram stop: Amandolier, line 12 and 15 (~8 min walk)</p>
                </div>
                
                <div className="pt-4">
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Chemin+Rieu+3+1208+Geneva+Switzerland"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 rounded-lg font-light"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              
              <div className="aspect-square w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.3215266260854!2d6.163555576866016!3d46.19528877109523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c7bd30d3182ef%3A0xe48dd26eb81d5b69!2sCTJFI%20(Come%20to%20Jesus%20Fellowship%20International)!5e1!3m2!1sen!2sch!4v1774604551112!5m2!1sen!2sch"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Church Location"
                />
              </div>
            </div>
          </div>
        </div>

        <div id="calendar" className="mt-32 max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-normal text-black mb-4">Service Times</h2>
          </div>
          
          <ServiceCalendar />
        </div>
      </main>
      
      <footer className="py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600 transition-colors duration-300">
          <p className="text-sm">&copy; 2026. Come to Jesus Fellowship International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
