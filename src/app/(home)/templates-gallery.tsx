"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { templates } from "@/constants/templates";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CreateTemplateDialog } from "@/components/createtemplate-dialogue";

export default function TemplatesGallery() {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);

  const onTemplateClick = (title: string, initialContent: string) => {
    setIsCreating(true);
    create({ title, initialContent })
      .catch(() => toast.error("Something went wrong."))

      .then((documentId) => {
        router.push(`/document/${documentId}`);
        toast.success("Document created.");
      })
      .finally(() => {
        setIsCreating(false);
      });
  };
  return (
    <div className="bg-[#F1F3F4]">
      <div className=" max-w-3xl mx-auto px-6 py-6 flex flex-col gap-y-4 ">
        <div className="flex gap-2">
          <h3 className=" font-medium ">Start New Document</h3>
          <CreateTemplateDialog>
            <div className="flex gap-1 hover:bg-slate-200 hover:cursor-pointer rounded-md px-2 ">
              <Plus />
              <h3 className=" font-medium ">Create New Template</h3>
            </div>
          </CreateTemplateDialog>
        </div>
        <Carousel>
          <CarouselContent className="-ml-4 ">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4  "
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5 ",
                    isCreating && "pointer-events-none opacity-0"
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() =>
                      onTemplateClick(template.label, template.initialConternt)
                    }
                    style={{
                      backgroundImage: `url(${template.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                  />
                  <p className=" text-sm font-medium truncate ">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
