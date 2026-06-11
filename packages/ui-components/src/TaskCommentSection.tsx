"use client";
import React, { useState } from "react";
import { cn } from "./utils";
import { UserAvatar } from "./UserAvatar";
import { Textarea } from "./Textarea";
import { Button } from "./Button";

export interface Comment {
  id: string;
  author: { id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskCommentSectionProps {
  taskId: string;
  comments: Comment[];
  currentUser?: { id: string; name: string; avatar?: string };
  onAddComment?: (taskId: string, content: string) => void;
  onDeleteComment?: (taskId: string, commentId: string) => void;
  onEditComment?: (taskId: string, commentId: string, content: string) => void;
  loading?: boolean;
  className?: string;
}

export function TaskCommentSection({
  taskId,
  comments,
  currentUser,
  onAddComment,
  onDeleteComment,
  onEditComment,
  loading = false,
  className,
}: TaskCommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment?.(taskId, newComment);
      setNewComment("");
    }
  };

  const handleEditSubmit = (commentId: string) => {
    if (editContent.trim()) {
      onEditComment?.(taskId, commentId, editContent);
      setEditingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-slate-900">Comments</h3>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-slate-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-slate-50">
              <UserAvatar
                name={comment.author.name}
                src={comment.author.avatar}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-slate-900">
                    {comment.author.name}
                  </p>
                  <span className="text-xs text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {editingId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditSubmit(comment.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-700 mt-1 break-words">
                      {comment.content}
                    </p>
                    {currentUser?.id === comment.author.id && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteComment?.(taskId, comment.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      {currentUser && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex gap-3">
            <UserAvatar
              name={currentUser.name}
              src={currentUser.avatar}
              size="sm"
            />
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewComment("")}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
