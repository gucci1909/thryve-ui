import{ useState } from 'react';
import { motion } from 'framer-motion';

const RoleInformationForm = ({ 
  initialData, 
  onNext, 
  onBack 
}) => {
  const [formData, setFormData] = useState({
    role: initialData?.role || '',
    teamSize: initialData?.teamSize || '',
    industry: initialData?.industry || '',
    challenges: initialData?.challenges || ''
  });

  const [errors, setErrors] = useState({
    challenges: false
  });

  const roles = ['Team Lead', 'Manager', 'Director', 'Head of Department', 'VP'];
  const teamSizes = ['1-5', '6-20', '20-50', '50+'];
  const industries = ['Banking', 'Finance', 'Health Care', 'Retail'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate challenges field has at least 2 problem areas
    const challengeCount = formData.challenges.split('\n').filter(line => line.trim().length > 0).length;
    setErrors({
      challenges: challengeCount < 2
    });

    if (challengeCount >= 2) {
      onNext({
        roleInfo: formData
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">About You</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            1. Your Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select your role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Team Size Dropdown */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
            2. Team Size
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select team size</option>
            {teamSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Industry Dropdown */}
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            3. Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        {/* Challenges Textarea */}
        <div>
          <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1">
            4. Top Challenges
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            placeholder="Write at least 2 problem areas that you are facing at your current role"
            rows={4}
            className={`w-full px-4 py-2 border ${errors.challenges ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            required
          />
          {errors.challenges && (
            <p className="mt-1 text-sm text-red-600">Please list at least 2 challenges</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RoleInformationForm;