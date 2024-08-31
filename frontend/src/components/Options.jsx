import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Options = ({ menus }) => {
  console.log(menus.title);
  return (
    <div className="w-full h-full shadow-sm border border-slate-200 rounded-t-lg">
      <div className="w-full flex items-center justify-between p-4 bg-white border-b border-slate-200 rounded-t-lg">
        <p>Options</p>
      </div>
      <div className="w-full max-h-[624px] overflow-y-auto divide-y">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <Accordion
              key={menu._id}
              type="single"
              collapsible
              className="w-full bg-white"
            >
              <AccordionItem value="item-1" className="divide-y">
                <AccordionTrigger className="py-8">
                  {menu.title}
                </AccordionTrigger>
                {menu.options?.length > 0 &&
                  menu.options.map((opt) => (
                    <AccordionContent
                      key={opt._id}
                      className="bg-slate-50 py-8 px-12  flex items-center justify-between"
                    >
                      <p>{opt.name}</p>
                      <p>{opt.price}</p>
                    </AccordionContent>
                  ))}
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <Accordion type="single" collapsible className="w-full bg-white">
            <AccordionItem value="item-1" className="divide-y">
              <AccordionTrigger className="py-8">{menus.title}</AccordionTrigger>
              {menus.options?.length > 0 && (
                      menus.options.map((opt) => (
                        <AccordionContent
                          key={opt._id}
                          className="bg-slate-50 py-8 px-12  flex items-center justify-between"
                        >
                          <p>{opt.name}</p>
                          <p>{opt.price}</p>
                        </AccordionContent>
                      ))
                    )}
            </AccordionItem>
          </Accordion>
        )}
        {/* {menus.length > 0 &&
          menus.map((menu) => (
            <div key={menu._id} className="w-full bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-8 w-full">
                  {menu.options?.length > 0 ? (
                    menu.options.map((opt) => (
                      <div
                        key={opt._id}
                        className="w-full flex items-center justify-between text-sm font-medium"
                      >
                        <div>{opt.name}</div>
                        <div className="text-gray-500">{opt.price} Baht</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-medium space-y-1">
                      <p>{menu.name}</p>
                      <p className="text-gray-500 text-xs">{menu.price} Baht</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  Add new features here
                </div>
              </div>
            </div>
          ))} */}
      </div>
    </div>
  );
};

export default Options;
