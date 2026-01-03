import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { ONBOARDING_STEPS } from '../../utils/constants';
import './OnboardingTour.css';

const OnboardingTour = () => {
  const { 
    showOnboarding, 
    currentStep, 
    completeOnboarding, 
    skipOnboarding, 
    nextStep, 
    prevStep 
  } = useOnboarding();

  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showOnboarding && ONBOARDING_STEPS[currentStep]) {
      const step = ONBOARDING_STEPS[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        
        // Highlight the element
        element.classList.add('onboarding-highlight');
        
        // Calculate tooltip position
        let top = rect.top + scrollY;
        let left = rect.left + scrollX;
        
        if (step.placement === 'bottom') {
          top = rect.bottom + scrollY + 10;
          left = rect.left + scrollX + (rect.width / 2);
        } else if (step.placement === 'left') {
          top = rect.top + scrollY + (rect.height / 2);
          left = rect.left + scrollX - 10;
        }
        
        setPosition({ top, left });
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return () => {
        // Remove highlight when step changes
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
          el.classList.remove('onboarding-highlight');
        });
      };
    }
  }, [showOnboarding, currentStep]);

  if (!showOnboarding) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  return (
    <>
      <div className="onboarding-overlay" onClick={skipOnboarding}></div>
      <div 
        className={`onboarding-tooltip onboarding-${step.placement}`}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="onboarding-header">
          <span className="onboarding-step-counter">
            Step {currentStep + 1} of {ONBOARDING_STEPS.length}
          </span>
          <button className="onboarding-skip" onClick={skipOnboarding}>
            Skip tour
          </button>
        </div>
        
        <h3 className="onboarding-title">{step.title}</h3>
        <p className="onboarding-content">{step.content}</p>
        
        <div className="onboarding-footer">
          {currentStep > 0 && (
            <button className="onboarding-btn onboarding-btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          <button className="onboarding-btn onboarding-btn-primary" onClick={handleNext}>
            {isLastStep ? 'Got it!' : 'Next'}
          </button>
        </div>
        
        <div className="onboarding-arrow"></div>
      </div>
    </>
  );
};

export default OnboardingTour;
