"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    BookOpen,
    Mail,
    Github,
    Twitter,
    Linkedin,
    Heart,
    ArrowRight,
    MessageCircle,
    TrendingUp,
    Users,
    Shield,
    FileText,
    HelpCircle
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-background border-t mt-auto"
        >
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">BookNest</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            Share, discover, and discuss amazing books with our growing community of readers worldwide.
                        </p>
                        <div className="flex space-x-3">
                            <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-colors">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-colors">
                                <Github className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-colors">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-primary/10 hover:text-primary transition-colors">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Discover</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center group">
                                    <BookOpen className="h-3 w-3 mr-2 group-hover:text-primary transition-colors" />
                                    All Books
                                </Link>
                            </li>
                            <li>
                                <Link href="/trending" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center group">
                                    <TrendingUp className="h-3 w-3 mr-2 group-hover:text-primary transition-colors" />
                                    Trending
                                </Link>
                            </li>
                            <li>
                                <Link href="/genres" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center group">
                                    <MessageCircle className="h-3 w-3 mr-2 group-hover:text-primary transition-colors" />
                                    Genres
                                </Link>
                            </li>
                            <li>
                                <Link href="/create" className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center">
                                    <ArrowRight className="h-3 w-3 mr-2" />
                                    Share a Book
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/dashboard" className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center">
                                    <Users className="h-3 w-3 mr-2" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center">
                                    <HelpCircle className="h-3 w-3 mr-2" />
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center">
                                    <Shield className="h-3 w-3 mr-2" />
                                    Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary text-sm transition-colors flex items-center">
                                    <MessageCircle className="h-3 w-3 mr-2" />
                                    Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Get notified about new book recommendations and community updates.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="text-sm"
                                disabled={isSubscribed}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="w-full"
                                disabled={isSubscribed || !email}
                            >
                                {isSubscribed ? (
                                    <span className="flex items-center">
                                        <Heart className="h-3 w-3 mr-1 fill-current" />
                                        Subscribed!
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Mail className="h-3 w-3 mr-1" />
                                        Subscribe
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="mb-6" />

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                        <p className="text-gray-600 text-sm">
                            © {currentYear} BookNest. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                            <Link href="#" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span>Made with</span>
                        <Heart className="h-3 w-3 mx-1 text-red-500 fill-current" />
                        <span>for book lovers</span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
