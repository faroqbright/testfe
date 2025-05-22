"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Trash2, Mail, CheckCircle, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [activeTab, setActiveTab] = useState("unread");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/contact/");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReadStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/contact/${id}`);
      fetchMessages();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error toggling read status", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`);
      fetchMessages();
      if (selectedMessage?._id === id) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting message", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.isAdmin) {
      fetchMessages();
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const unreadMessages = messages.filter((m) => !m.isRead);
  const readMessages = messages.filter((m) => m.isRead);

  const currentMessages =
    activeTab === "unread" ? unreadMessages : readMessages;
  const totalPages = Math.ceil(currentMessages.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedMessages = currentMessages.slice(
    startIndex,
    startIndex + limit
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage contact messages and inquiries
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Mail className="w-4 h-4 mr-1" />
            {unreadMessages.length} Unread
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            {readMessages.length} Read
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            View and manage all contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="unread"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="unread" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Unread Messages
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Read Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-0">
              {unreadMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No unread messages
                </div>
              ) : (
                <MessageTable
                  messages={paginatedMessages}
                  onView={(msg) => {
                    setSelectedMessage(msg);
                    setIsModalOpen(true);
                  }}
                  onDelete={deleteMessage}
                  showDeleteButton={false}
                />
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-0">
              {readMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No read messages
                </div>
              ) : (
                <MessageTable
                  messages={paginatedMessages}
                  onView={(msg) => {
                    setSelectedMessage(msg);
                    setIsModalOpen(true);
                  }}
                  onDelete={deleteMessage}
                  showDeleteButton={true}
                />
              )}
            </TabsContent>
          </Tabs>

          {currentMessages.length > 0 && (
            <CustomPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <MessageDetailsDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        message={selectedMessage}
        onToggleRead={toggleReadStatus}
        onDelete={deleteMessage}
        formatDate={formatDate}
      />
    </div>
  );
};

const MessageTable = ({ messages, onView, onDelete, showDeleteButton }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((msg) => (
          <TableRow key={msg._id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{msg.name}</TableCell>
            <TableCell>{msg.email}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {msg.subject}
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {new Date(msg.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(msg)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>

                {showDeleteButton && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(msg._id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i + 1)}
              isActive={currentPage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const MessageDetailsDialog = ({
  isOpen,
  onOpenChange,
  message,
  onToggleRead,
  onDelete,
  formatDate,
}) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <div className="relative">
          {/* Status badge - positioned absolutely for better design */}
          <Badge
            variant={message.isRead ? "outline" : "secondary"}
            className="absolute right-0 top-0"
          >
            {message.isRead ? "Read" : "Unread"}
          </Badge>

          <DialogTitle className="text-xl pr-16 pb-2 border-b">
            {message.subject}
          </DialogTitle>

          <div className="mt-6 space-y-6">
            {/* Sender information card */}
            <div className="bg-muted/40 rounded-lg p-4 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">{message.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${message.email}`}
                      className="text-primary hover:underline flex items-center"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      {message.email}
                    </a>
                    {message.phoneNumber && (
                      <>
                        <span>•</span>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {message.phoneNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                Received:{" "}
                {message.createdAt ? formatDate(message.createdAt) : "Unknown"}
              </div>
            </div>

            {/* Message content */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Message:
              </h3>
              <div className="bg-muted p-4 rounded-lg border whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant={message.isRead ? "outline" : "default"}
                onClick={() => onToggleRead(message._id)}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {message.isRead ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Mark as Unread
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark as Read
                  </>
                )}
              </Button>

              {message.isRead && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(message._id);
                    onOpenChange(false);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Message
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto ml-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
