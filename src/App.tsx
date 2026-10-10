/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modal from './components/Modal';

export default function App() {
  const [activeSection, setActiveSection] = useState('Home');
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    title: string;
    type: string;
  }>({
    isOpen: false,
    title: '',
    type: '',
  });

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    switch (section.toLowerCase()) {
      case 'home':
        break;
      case 'about':
        setActiveModal({ isOpen: true, title: 'About Us', type: 'about' });
        break;
      case 'work':
      case 'explore our work':
        setActiveModal({ isOpen: true, title: 'Featured Work', type: 'work' });
        break;
      case 'services':
        setActiveModal({ isOpen: true, title: 'Services & Capabilities', type: 'services' });
        break;
      case 'contact':
      case "let's talk":
      case 'pitch us an idea':
        setActiveModal({ isOpen: true, title: "Let's Talk", type: 'talk' });
        break;
      case 'watch showreel':
        setActiveModal({ isOpen: true, title: '2026 Showreel', type: 'showreel' });
        break;
      default:
        setActiveModal({ isOpen: true, title: section, type: 'work' });
        break;
    }
  };

  const closeModal = () => {
    setActiveModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#237783]">
      {/* Background Video (mouse-scrub controlled) */}
      <BackgroundVideo />

      {/* Fixed top Navbar */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Hero Section */}
      <Hero onSelectAction={handleSelectSection} />

      {/* Interactive Modal for navigation & video actions */}
      <Modal
        isOpen={activeModal.isOpen}
        onClose={closeModal}
        title={activeModal.title}
        type={activeModal.type}
      />
    </div>
  );
}
