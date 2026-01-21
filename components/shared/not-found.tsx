"use client";

import React from "react";
import AppLayout from "../layouts/app-layout";

interface NotFoundProps {
  title?: string;
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Data Not Found",
  message = "We couldn't load the requested data. Please try again later."
}) => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-6">
          {message}
        </p>
      </div>
    </AppLayout>
  );
};

export default NotFound;