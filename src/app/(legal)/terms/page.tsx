"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Scale, Users, BookOpen, Shield, AlertTriangle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 mb-4">
              <Scale className="h-4 w-4 mr-2" />
              Legal Terms
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Please read these terms carefully before using BookNest. By using our platform, you agree to these terms.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last updated: June 20, 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing and using BookNest ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service ("Terms") govern your use of our book-sharing platform and community features.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  <strong>Important:</strong> If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <Users className="h-6 w-6 mr-3 text-green-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Account Security</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Notify us immediately of any unauthorized account access
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use accurate and current information in your profile
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Content Guidelines</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share only legal and legitimate book content
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Respect intellectual property rights and copyright laws
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Provide accurate book descriptions and metadata
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Engage respectfully in community discussions
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To maintain a safe and legal platform for all users, the following activities are strictly prohibited:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Content Violations</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li>• Sharing copyrighted content without permission</li>
                    <li>• Uploading malicious or harmful files</li>
                    <li>• Posting spam or misleading information</li>
                    <li>• Sharing inappropriate or offensive content</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Platform Abuse</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li>• Attempting to hack or exploit the system</li>
                    <li>• Creating multiple fake accounts</li>
                    <li>• Manipulating ratings or reviews</li>
                    <li>• Harassing other community members</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  <strong>Consequences:</strong> Violation of these terms may result in content removal, account suspension, or permanent ban from the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Platform Content</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  BookNest and its original content, features, and functionality are owned by BookNest and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">User-Generated Content</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  You retain ownership of content you create and share on BookNest. However, by posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the platform.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Copyright Respect</h4>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  We respect intellectual property rights and expect our users to do the same. If you believe content on our platform infringes your copyright, please contact us with details for prompt review.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                <Shield className="h-6 w-6 mr-3 text-indigo-600" />
                Service Availability & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Service Availability</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Maintenance, updates, or unforeseen circumstances may temporarily affect availability.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Content Moderation</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    We reserve the right to review, modify, or remove content that violates our terms or community guidelines, with or without notice to the user.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Disclaimer</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  BookNest is provided "as is" without warranties of any kind. We are not responsible for user-generated content or external links shared on the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                These terms may be updated periodically. Continued use of BookNest after changes constitutes acceptance of the new terms. Contact us if you have any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Contact Legal Team
                </Button>
                <Button variant="outline">
                  View Privacy Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
