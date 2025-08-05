import { Clock, RefreshCw, Shield, Truck } from "lucide-react";

const features = [
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round the clock customer service'
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free shipping on all orders'
    },
    {
      icon: RefreshCw,
      title: '7 Days Replacement',
      description: 'Easy returns & exchanges'
    },
    {
      icon: Shield,
      title: 'Quality Product',
      description: 'Certified quality assurance'
    }
  ];
function Features() {
    return (
        <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    )
}

export default Features
