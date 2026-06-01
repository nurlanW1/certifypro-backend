/**
 * Stripe.js Integration
 * 
 * This module provides Stripe.js integration for payment processing.
 * 
 * Reference: https://github.com/stripe/stripe-js
 * Documentation: https://stripe.com/docs/js
 */

(function() {
  'use strict';

  /**
   * Stripe Manager
   * Handles Stripe.js initialization and payment processing
   */
  window.StripeManager = {
    /**
     * Stripe instance
     */
    stripe: null,

    /**
     * Publishable key
     */
    publishableKey: null,

    /**
     * Initialize Stripe.js
     * @param {string} publishableKey - Stripe publishable key
     * @returns {Promise<Stripe>} Promise that resolves with Stripe instance
     */
    async init(publishableKey) {
      if (!publishableKey) {
        console.warn('Stripe publishable key is required');
        return null;
      }

      this.publishableKey = publishableKey;

      // Check if Stripe.js is already loaded
      if (typeof Stripe !== 'undefined') {
        this.stripe = new Stripe(publishableKey);
        return this.stripe;
      }

      // Load Stripe.js from CDN
      return new Promise((resolve, reject) => {
        // Check if script is already loading
        if (document.querySelector('script[src*="js.stripe.com"]')) {
          // Wait for Stripe to be available
          const checkStripe = setInterval(() => {
            if (typeof Stripe !== 'undefined') {
              clearInterval(checkStripe);
              this.stripe = new Stripe(publishableKey);
              resolve(this.stripe);
            }
          }, 100);
          return;
        }

        // Create and inject script tag
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
          if (typeof Stripe !== 'undefined') {
            this.stripe = new Stripe(publishableKey);
            resolve(this.stripe);
          } else {
            reject(new Error('Stripe.js failed to load'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to load Stripe.js script'));
        };
        document.head.appendChild(script);
      });
    },

    /**
     * Get Stripe instance (initialize if needed)
     * @returns {Stripe|null} Stripe instance or null
     */
    getInstance() {
      if (!this.stripe && this.publishableKey) {
        this.init(this.publishableKey);
      }
      return this.stripe;
    },

    /**
     * Create payment element
     * @param {HTMLElement} container - Container element for payment form
     * @param {Object} options - Payment element options
     * @returns {Promise<Object>} Promise that resolves with payment element
     */
    async createPaymentElement(container, options = {}) {
      const stripe = this.getInstance();
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      // Create payment element
      const elements = stripe.elements({
        clientSecret: options.clientSecret,
        appearance: options.appearance || {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
            colorBackground: '#ffffff',
            colorText: '#111827',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px'
          }
        }
      });

      const paymentElement = elements.create('payment', {
        layout: options.layout || 'tabs'
      });

      await paymentElement.mount(container);

      return {
        elements,
        paymentElement
      };
    },

    /**
     * Confirm payment
     * @param {Object} paymentElement - Payment element instance
     * @param {Object} options - Payment confirmation options
     * @returns {Promise<Object>} Promise that resolves with payment result
     */
    async confirmPayment(paymentElement, options = {}) {
      const stripe = this.getInstance();
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements: paymentElement.elements,
        confirmParams: {
          return_url: options.returnUrl || window.location.origin + '/payment-success',
          ...options.confirmParams
        },
        redirect: options.redirect !== false ? 'if_required' : 'never'
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    },

    /**
     * Create checkout session
     * @param {Object} options - Checkout session options
     * @returns {Promise<void>}
     */
    async redirectToCheckout(options) {
      const stripe = this.getInstance();
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: options.sessionId
      });

      if (error) {
        throw error;
      }
    },

    /**
     * Create payment method
     * @param {Object} paymentElement - Payment element instance
     * @returns {Promise<Object>} Promise that resolves with payment method
     */
    async createPaymentMethod(paymentElement) {
      const stripe = this.getInstance();
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements: paymentElement.elements,
        params: {
          type: 'card'
        }
      });

      if (error) {
        throw error;
      }

      return paymentMethod;
    }
  };

  /**
   * Helper function to initialize Stripe with publishable key
   * @param {string} publishableKey - Stripe publishable key
   * @returns {Promise<Stripe>} Promise that resolves with Stripe instance
   */
  window.initStripe = async function(publishableKey) {
    return await StripeManager.init(publishableKey);
  };

  /**
   * Helper function to create payment form
   * @param {string} containerId - Container element ID
   * @param {Object} options - Payment form options
   * @returns {Promise<Object>} Promise that resolves with payment element
   */
  window.createStripePaymentForm = async function(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }

    return await StripeManager.createPaymentElement(container, options);
  };

  console.log('Stripe.js integration loaded');
  console.log('Usage: await StripeManager.init("pk_test_...")');
})();
