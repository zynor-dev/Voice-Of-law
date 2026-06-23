// src/pages/FaqPage.jsx
import React, { useState } from 'react';
import '../styles/FaqPage.css';

const faqData = [
  {
    question: 'How does VoiceofLAw work?',
    answer: 'VoiceofLAw leverages advanced AI to provide a range of legal services. You can ask natural language questions to search for documents, perform legal research efficiently, and utilize AI to generate legal documentation.',
  },
  {
    question: 'Is VoiceofLAw designed to replace lawyers?',
    answer: 'No, VoiceofLAw complements rather than replaces lawyers. It supports legal professionals by handling routine tasks and providing valuable insights, allowing them to focus on strategic decision-making and client relations.',
  },
  {
    question: 'Is VoiceofLAw suitable for legal professionals only?',
    answer: 'VoiceofLAw is designed for legal professionals, but its user-friendly interface makes it accessible for anyone seeking legal information or assistance. It is a powerful tool for law students and individuals as well.',
  },
  {
    question: 'How can VoiceofLAw contribute to my firm’s success?',
    answer: 'By automating research, document generation, and other time-consuming tasks, VoiceofLAw helps your firm increase efficiency, reduce operational costs, and improve overall productivity. This allows your team to focus on high-value work.',
  },
  {
    question: 'Do I need prior experience with AI to use VoiceofLAw?',
    answer: 'No, our platform is designed to be intuitive and easy to use. The AI-powered features are integrated seamlessly into the user interface, so you can leverage them without any prior experience in artificial intelligence.',
  },
  {
    question: 'Beyond productivity, what other benefits can VoiceofLAw offer my firm?',
    answer: 'VoiceofLAw helps ensure accuracy in legal documents, offers up-to-date legal insights, and provides a competitive edge by allowing your firm to deliver faster and more precise legal services to your clients.',
  },
  {
    question: 'How can lawyers and legal professionals make the most of VoiceofLAw?',
    answer: 'By using VoiceofLAw for initial research, drafting legal documents, and summarizing complex cases, legal professionals can significantly cut down on manual work. They can also use it as a learning tool to stay updated with legal trends.',
  },
  {
    question: 'How does VoiceofLAw assist with document management?',
    answer: 'VoiceofLAw can help in organizing, searching, and analyzing large volumes of legal documents. Its AI capabilities can quickly find relevant information, summarize key points, and ensure consistency across your documents.',
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1 className="faq-title">
          <span className="mustard-text">Questions About VoiceofLaw?</span>
          <br />
          <span className="white-text">We have Answers!</span>
        </h1>
        <p className="faq-description">
          Please feel free to reach out to us. We are always happy to assist
          you and provide any additional information.
        </p>
      </div>
      <div className="faq-grid">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className={`faq-card ${openIndex === index ? 'open' : ''}`}
            onClick={() => toggleAnswer(index)}
          >
            <div className="faq-question-row">
              <h4 className="faq-question">{faq.question}</h4>
              <span className="faq-toggle-icon">
                {openIndex === index ? '-' : '+'}
              </span>
            </div>
            {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;