import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
    Shield, 
    Mail, 
    FileText, 
    AlertTriangle, 
    Clock,
    Users,
    Scale
} from "lucide-react";
import Link from "next/link";

export default function DMCAPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Scale className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">DMCA Policy</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    BookNest respects intellectual property rights and responds to valid DMCA notices in accordance with the Digital Millennium Copyright Act.
                </p>
                <Badge variant="secondary" className="mt-4">
                    <Clock className="h-3 w-3 mr-1" />
                    Last updated: December 2024
                </Badge>
            </div>

            <div className="space-y-8">
                {/* Quick Contact Alert */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Need to report copyright infringement?</strong> Email us at{" "}
                        <a href="mailto:dmca@booknest.com" className="text-primary hover:underline font-medium">
                            dmca@booknest.com
                        </a>{" "}
                        with all required information listed below.
                    </AlertDescription>
                </Alert>

                {/* Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            Copyright Protection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            BookNest is committed to protecting the intellectual property rights of content creators, authors, and publishers. We take copyright infringement seriously and will respond promptly to valid DMCA takedown notices.
                        </p>
                        <p>
                            This policy outlines our procedures for responding to claims of copyright infringement and describes the information required for valid DMCA notices.
                        </p>
                    </CardContent>
                </Card>

                {/* Filing a DMCA Notice */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Filing a DMCA Takedown Notice
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p>
                            If you believe that content on BookNest infringes your copyright, you may submit a DMCA takedown notice. Your notice must include all of the following information:
                        </p>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">1. Identification of Copyrighted Work</h4>
                                <p className="text-sm text-muted-foreground">
                                    A description of the copyrighted work that you claim has been infringed, including the title, author, and publication details if applicable.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">2. Identification of Infringing Material</h4>
                                <p className="text-sm text-muted-foreground">
                                    The specific URL(s) or location(s) of the infringing material on BookNest that you want removed or access to which you want disabled.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">3. Your Contact Information</h4>
                                <p className="text-sm text-muted-foreground">
                                    Your name, address, telephone number, and email address.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">4. Good Faith Statement</h4>
                                <p className="text-sm text-muted-foreground">
                                    A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">5. Accuracy Statement</h4>
                                <p className="text-sm text-muted-foreground">
                                    A statement that the information in your notice is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the copyright owner.
                                </p>
                            </div>

                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-semibold mb-2">6. Physical or Electronic Signature</h4>
                                <p className="text-sm text-muted-foreground">
                                    Your physical or electronic signature.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Counter-Notice */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Counter-Notice Procedure
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            If you believe that content you posted was wrongfully removed due to a DMCA notice, you may file a counter-notice. Your counter-notice must include:
                        </p>
                        
                        <ul className="space-y-2 ml-4">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-sm">Your name, address, phone number, and email address</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-sm">Identification of the material and its location before removal</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-sm">A statement under penalty of perjury that the material was removed by mistake</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-sm">Consent to jurisdiction of Federal District Court</span>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-sm">Your physical or electronic signature</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="h-5 w-5 mr-2" />
                            DMCA Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            All DMCA notices and counter-notices should be sent to our designated copyright agent:
                        </p>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="font-semibold">BookNest DMCA Agent</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Email:{" "}
                                <a href="mailto:dmca@booknest.com" className="text-primary hover:underline">
                                    dmca@booknest.com
                                </a>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Subject Line: "DMCA Takedown Notice" or "DMCA Counter-Notice"
                            </p>
                        </div>

                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Please note that we may share copies of DMCA notices and counter-notices with third parties, including the Electronic Frontier Foundation and legal databases.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Response Time */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="h-5 w-5 mr-2" />
                            Response Timeframe
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            We typically respond to valid DMCA notices within 2-3 business days. Upon receiving a valid notice, we will promptly remove or disable access to the allegedly infringing material and notify the user who posted the content.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-8" />

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                    <Link href="/privacy">Privacy Policy</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/terms">Terms of Service</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Back to BookNest</Link>
                </Button>
            </div>
        </div>
    );
}
