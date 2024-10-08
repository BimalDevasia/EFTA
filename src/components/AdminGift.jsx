"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Equal } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { isNumber } from "@/lib/validators";

const schema = z
  .object({
    productName: z.string().min(1, "Product Name is required"),
    description: z.string().min(1, "Description is required"),
    productDetails: z.string().min(1, "Product Details are required"),
    productCategory: z.string().min(1, "Product Category is required"),
    productMRP: z.number().min(0, "MRP must be positive"),
    offerPercentage: z
      .number()
      .min(0)
      .max(100, "Percentage must be between 0 and 100"),
    productType: z.enum([
      "non-customisable",
      "customisable",
      "heavyCustomisable",
    ]),
    customTextHeading: z.string().optional(),
    numberOfCustomImages: z
      .number()
      .int()
      .min(0, "Number of images must be non-negative")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.productType === "customisable" ||
        data.productType === "heavyCustomisable"
      ) {
        return (
          data.numberOfCustomImages > 0 &&
          data.customTextHeading &&
          data.customTextHeading.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Customisable products must have a custom text heading and a positive number of custom images",
      path: ["root"],
    }
  );

function AdminGift() {
  const [selectedValue, setSelectedValue] = useState("non-customisable");
  const resize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      offerPercentage: 0,
      productMRP: 0,
      productType: "non-customisable",
      numberOfCustomImages: 0,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const offerPercentage = watch("offerPercentage");
  const productMRP = watch("productMRP");

  const productType = watch("productType");

  const offerPrice =
    isNumber(offerPercentage) && isNumber(productMRP)
      ? ((100 - offerPercentage) / 100) * productMRP
      : "NaN";

  console.log("offerPrice", offerPrice);

  return (
    <div className="flex w-full overflow-y-auto h-full">
      <div className="w-40 px-5 flex flex-col gap-5">
        <img
          src="/product-image.png"
          alt=""
          className="w-32 h-32 object-cover bg-no-repeat"
        />
        <p className="font-poppins font-medium ">Coffee Mug</p>
      </div>
      <div className="flex-1 px-5 flex flex-col gap-[26px] pt-5 border-l-2  border-solid">
        <div className="flex justify-between items-center">
          <p className="  text-nav_blue text-4xl font-poppins font-bold ">
            Gifts Details
          </p>
          <div className="flex gap-3">
            <button className="w-44 h-12 px-3 border-[#8300FF] border-2 font-poppins font-bold text-[#8300FF] text-xl">
              {" "}
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="w-44 h-12 px-3  bg-[#8300FF] font-poppins font-bold text-white text-xl  "
            >
              {" "}
              Save
            </button>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Product Name</p>
            <input
              {...register("productName")}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-xl font-medium font-poppins overflow-hidden"
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Description</p>
            <textarea
              {...register("description")}
              rows={1}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-normal font-poppins overflow-hidden"
              onInput={(e) => resize(e.target)}
            ></textarea>
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">Product Details</p>
            <textarea
              {...register("productDetails")}
              rows={1}
              className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
              onInput={(e) => resize(e.target)}
            ></textarea>
            {errors.productDetails && (
              <p className="text-red-500">{errors.productDetails.message}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins text-base font-light">
              Product Category
            </p>
            <Controller
              name="productCategory"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem className="cursor-pointer" value="gift">
                      Gift
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer"
                      value="corporate-gifts"
                    >
                      Corporate Gifts
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="cakes">
                      Cakes
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.productCategory && (
              <p className="text-red-500">{errors.productCategory.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-7 items-center">
          <div>
            <p className="font-poppins text-base font-light">Product MRP</p>
            <input
              {...register("productMRP", { valueAsNumber: true })}
              className="resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden"
            />
            {errors.productMRP && (
              <p className="text-red-500">{errors.productMRP.message}</p>
            )}
          </div>
          <div>
            <p className="font-poppins text-base font-light">
              Offer Percentage
            </p>
            <input
              {...register("offerPercentage", { valueAsNumber: true })}
              className="resize-none border-[#0000004D] border-2 w-40 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden"
            />
            {errors.offerPercentage && (
              <p className="text-red-500">{errors.offerPercentage.message}</p>
            )}
          </div>

          <div className="text-2xl font-poppins font-light h-fit self-end mb-4">
            <Equal />
          </div>

          <div>
            <p className="font-poppins text-base font-light">Offer Prize</p>
            <input
              disabled
              value={offerPrice}
              className="resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden"
            />
          </div>
        </div>

        {/*  need image upload*/}

        <div className="flex flex-col gap-2">
          <p className="font-poppins text-base font-light">Product Type</p>

          <Controller
            name="productType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                className="flex gap-3"
                onValueChange={(value) => {
                  setSelectedValue(value);
                  field.onChange(value);
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="non-customisable"
                    id="non-customisable"
                  />
                  <Label
                    htmlFor="non-customisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "non-customisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Non Customisable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customisable" id="customisable" />
                  <Label
                    htmlFor="customisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "customisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Customisable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="heavyCustomisable"
                    id="heavyCustomisable"
                  />
                  <Label
                    htmlFor="heavyCustomisable"
                    className={`font-poppins text-base  ${
                      selectedValue === "heavyCustomisable"
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    Heavy Customisable
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.productType && (
            <p className="text-red-500">{errors.productType.message}</p>
          )}
        </div>

        {(productType === "customisable" ||
          productType === "heavyCustomisable") && (
          <>
            <div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins text-base font-light">
                  Custom Text Heading
                </p>
                <input
                  {...register("customTextHeading")}
                  className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
                />
                {errors.customTextHeading && (
                  <p className="text-red-500">
                    {errors.customTextHeading.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-2">
                <p className="font-poppins text-base font-light">
                  Number of Custom Images
                </p>
                <input
                  {...register("numberOfCustomImages", { valueAsNumber: true })}
                  className="resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden"
                />
                {errors.numberOfCustomImages && (
                  <p className="text-red-500">
                    {errors.numberOfCustomImages.message}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminGift;
