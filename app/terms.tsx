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

export default function TermsOfUse() {
  return (
    <PrivacyContainer>
      <PrivacyHeading>Essence Terms of Use</PrivacyHeading>

      <PrivacySubheading>Introduction</PrivacySubheading>
      <PrivacyText>
        These Terms of Use ('Terms') regulate your access and utilization of the Essence service ('Service'), offered by Essence Inc. ('Essence', 'we', 'us', 'our'). Accessing or using the Service signifies your acceptance of these Terms. If you disagree with these Terms, you should not access or use the Service
      </PrivacyText>

      <PrivacySubheading>Eligibility</PrivacySubheading>
      <PrivacyText>
        For accessing and using the Service, you need to be at least 13 years old or meet the minimum age requirement in your country, possess an active Google account, and reside in a country where the Service is accessible. By utilizing the Service, you confirm and guarantee that you fulfill these eligibility criteria.
      </PrivacyText>

      <PrivacySubheading>Privacy</PrivacySubheading>
      <PrivacyText>
        We value your privacy. Kindly examine our Privacy Policy, detailing the methods of our collection, utilization, and safeguarding of your personal data. Utilizing the Service constitutes your agreement to our collection and usage of your information as per our Privacy Policy
      </PrivacyText>

      <PrivacySubheading>User Conduct</PrivacySubheading>
      <PrivacyText>
        You agree to use the Service responsibly and lawfully, not engaging in any conduct that is illegal, harmful, or violates others' rights. This includes refraining from distributing harmful content, infringing intellectual property, or engaging in fraudulent activities
      </PrivacyText>

      <PrivacySubheading>Intellectual Property Rights</PrivacySubheading>
      <PrivacyText>
        All content on the Service, including text, graphics, logos, and software, is owned by Essence or its licensors. You agree not to copy, modify, or distribute any content without authorization
      </PrivacyText>

      <PrivacySubheading>Third-Party Services</PrivacySubheading>
      <PrivacyText>
        The Service may include or link to third-party services. Your use of these services is subject to their respective terms and policies, and Essence is not responsible for their content or practices
      </PrivacyText>

      <PrivacySubheading>Dispute Resolution</PrivacySubheading>
      <PrivacyText>
        Any disputes related to these Terms will be resolved through final and binding arbitration, following the rules of the American Arbitration Association, in Delaware, USA.
      </PrivacyText>

      <PrivacySubheading>Modifications and Termination</PrivacySubheading>
      <PrivacyText>
        Essence reserves the right to modify or terminate the Service or your access to it for any reason, without notice, at any time. You agree that Essence will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service
      </PrivacyText>

      <PrivacySubheading>Disclaimer of Warranties</PrivacySubheading>
      <PrivacyText>
        Essence reserves the right to modify or terminate the Service or your access to it for any reason, without notice, at any time. You agree that Essence will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service
      </PrivacyText>

      <PrivacySubheading>Email Consent</PrivacySubheading>
      <PrivacyText>
        By using the Service, you consent to receive emails from Essence, including updates, offers, and promotional content related to the Service. You can opt out of these communications at any time
      </PrivacyText>

      <PrivacySubheading>Changes to the Terms</PrivacySubheading>
      <PrivacyText>
        Essence may update these Terms periodically. Your continued use of the Service after any changes indicates your acceptance of the new Terms. We recommend reviewing the Terms regularly
      </PrivacyText>

      <PrivacySubheading>Indemnification</PrivacySubheading>
      <PrivacyText>
        You agree to indemnify and hold harmless Essence, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, liabilities, and expenses arising from your use of the Service
      </PrivacyText>

      <PrivacySubheading>Limitation of Liability</PrivacySubheading>
      <PrivacyText>
        Essence is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service
      </PrivacyText>

      <PrivacySubheading>Force Majeure</PrivacySubheading>
      <PrivacyText>
        Essence is not responsible for failures or delays in performing its obligations due to circumstances beyond its control, such as natural disasters, war, or government actions.
      </PrivacyText>

      <PrivacySubheading>Severability</PrivacySubheading>
      <PrivacyText>
        If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect and be enforceable
      </PrivacyText>

      <PrivacySubheading>Contact Us</PrivacySubheading>
      <PrivacyText>
        If you have any questions about these Terms, please contact us at hi@getessence.app
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
