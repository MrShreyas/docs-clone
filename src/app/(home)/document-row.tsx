import { TableRow, TableCell } from "@/components/ui/table";
import { Doc } from "../../../convex/_generated/dataModel";
import { format } from "date-fns";

import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUser } from "lucide-react";
import { DocumentMenu } from "./document-menu";
import { useRouter } from "next/navigation";

interface DocumentRowProps {
  document: Doc<"documents">;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();

  return (
    <TableRow
      onClick={() => router.push(`/document/${document._id}`)}
      className=" cursor-pointer"
    >
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className=" font-medium md:w-[45%] ">
        {document.title}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2 ">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUser className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell ">
        {format(new Date(document._creationTime), "MMM dd, yyyy")}
      </TableCell>
      <TableCell
        className=" flex justify-end "
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={() => window.open(`/document/${document._id}`, "_blank")}
        />
      </TableCell>
    </TableRow>
  );
};
