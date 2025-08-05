import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';

function ErrorPage({ customErrorMessage }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.3 }
    }),
  };

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | ShoppyX</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist. Return to ShoppyX and explore our wide range of products." />
        <meta name="keywords" content="ShoppyX 404, page not found, missing page, broken link, online shopping" />
        <meta property="og:title" content="404 Error | Page Not Found - ShoppyX" />
        <meta property="og:description" content="We couldn't find the page you were looking for. Discover trending fashion, electronics and more on ShoppyX!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shoppy-x.vercel.app/404" />
        <meta property="og:image" content="https://shoppy-x.vercel.app/og-default.jpg" />
        <link rel="canonical" href="https://shoppy-x.vercel.app/404" />
      </Helmet>

      <motion.section
        className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-tr from-blue-50 to-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-2xl text-center bg-white rounded-xl shadow-lg p-6 sm:p-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="flex justify-center text-blue-600 mb-4"
            custom={0}
            variants={itemVariants}
          >
            <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16" />
          </motion.div>

          <motion.h1
            className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3"
            custom={1}
            variants={itemVariants}
          >
            {customErrorMessage || "404 - Page Not Found"}
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base text-gray-600 mb-6"
            custom={2}
            variants={itemVariants}
          >
            The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5"
            custom={3}
            variants={itemVariants}
          >
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 text-sm font-medium  text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Take Me Home
            </button>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}

export default ErrorPage;
