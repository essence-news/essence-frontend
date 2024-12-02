import React from 'react';
import { Link } from 'expo-router';
import {
  PrivacyContainer,
  PrivacyHeading,
  PrivacySubheading,
  PrivacyText,
  PrivacyLink,
  MainContainer
} from '@/components/SharedComponents';

const PrivacyPolicy = () => {
  return (
    <PrivacyContainer>
      <PrivacyHeading>Essence Privacy Policy</PrivacyHeading>

      <PrivacyText>
        We ("Essence," "we," "us," or "our") value the privacy of you ("user" or "you").
        This Privacy Policy outlines how we collect, use, and safeguard your information when you use our website https://www.getessence.app (the "Site"), including our Chrome Extension.
        By using the Site, you consent to the data practices described in this policy.
      </PrivacyText>

      <PrivacySubheading>Data collection and usage</PrivacySubheading>
      <PrivacyText>
        We collect information in the following ways:{'\n\n'}
        Personal Data: We collect your name and email address when you register. We also collect your country and location based on browser locale. Additional optional information such as company details, industry, and professional profile links may be collected when you customize your preferences.{'\n'}
        Derivative Data: Automatically collected information includes your browser type, operating system, access times, and locale settings.{'\n'}
        App Usage Data: We monitor how you use our application, including your content and feature preferences, to enhance our services.{'\n'}
        Use of Information{'\n'}
        Your information is used to manage your account, produce anonymized analytics, and ensure the functionality of our services.
      </PrivacyText>

      <PrivacySubheading>Cookies and Tracking Technologies</PrivacySubheading>
      <PrivacyText>
        We use local storage to store app-specific information on your device. We also collect usage data through our internal analytics system. We do not use cookies for tracking or data collection purposes.
      </PrivacyText>

      <PrivacySubheading>Data Sharing</PrivacySubheading>
      <PrivacyText>
        We do not share your personal data with any third parties, except as required by law.
      </PrivacyText>

      <PrivacySubheading>Data Retention</PrivacySubheading>
      <PrivacyText>
        We retain your personal information for as long as it is necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.
      </PrivacyText>

      <PrivacySubheading>Data Security</PrivacySubheading>
      <PrivacyText>
        We implement a variety of security measures to maintain the safety of your personal information. While we strive to protect your information, no security measures can guarantee absolute protection.
      </PrivacyText>

      <PrivacySubheading>Your Choices and Rights</PrivacySubheading>
      <PrivacyText>
        You have the right to review, change, or delete your personal information by emailing us at hi@getessence.app, by deleting your profile within the app.
      </PrivacyText>

      <PrivacySubheading>Changes to This Privacy Policy</PrivacySubheading>
      <PrivacyText>
        We may update this policy from time to time. We encourage users to review this policy periodically.
      </PrivacyText>

      <PrivacySubheading>Contact us</PrivacySubheading>
      <PrivacyText>
        For any questions or comments about this Privacy Policy, please contact us at hi@getessence.app
      </PrivacyText>

      <PrivacySubheading>Effective Date</PrivacySubheading>
      <PrivacyText>
        This policy is effective as of 01 Nov 2024
      </PrivacyText>

      <PrivacyText>
        © {new Date().getFullYear()}{' '}
        <Link href="https://www.getessence.app" asChild>
          <PrivacyLink>Essence</PrivacyLink>
        </Link>
      </PrivacyText>
    </PrivacyContainer>
  );
};

export default PrivacyPolicy;