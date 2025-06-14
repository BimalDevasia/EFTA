"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Breadcrumb from "@/components/Breadcrumb";
import NormalCardCarousal from "@/components/NormalCardCarousal";
import ProductDetails from "@/components/ProductDetails";
import Wrapper from "@/components/Wrapper";
import { SpecialText } from "@/components/typography";
import Link from "next/link";

const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gift/${params.productid}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data.gift);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.productid) {
      fetchProduct();
    }
  }, [params.productid]);

  // Generate dynamic breadcrumb links
  const links = [
    {
      name: "Gifts",
      href: "/gifts",
    },
    {
      name: product?.productCategory ? 
        product.productCategory.charAt(0).toUpperCase() + product.productCategory.slice(1) : 
        "Category",
      href: `/gifts/${product?.productCategory || ''}`,
    },
  ];

  if (loading) {
    return (
      <Wrapper className="pt-32 pb-[100px]">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper className="pt-32 pb-[100px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error === 'Product not found' ? 'Product Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error === 'Product not found' 
              ? 'The product you are looking for does not exist.' 
              : 'There was an error loading the product details.'}
          </p>
          <Link 
            href="/gifts" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Gifts
          </Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <>
      {product && (
        <Head>
          <title>{product.productName} - EFTA Gifts</title>
          <meta name="description" content={product.description} />
          <meta property="og:title" content={product.productName} />
          <meta property="og:description" content={product.description} />
          {product.images && product.images.length > 0 && (
            <meta property="og:image" content={product.images[0].url} />
          )}
        </Head>
      )}
      <Wrapper className="pt-32 pb-[100px] space-y-[100px]">
        <div className="space-y-[30px]">
          <Breadcrumb links={links} />
          <ProductDetails product={product} />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="pl-6">
              <SpecialText>Similar Products</SpecialText>
            </h2>
            <Link href="/gifts">
              <SpecialText className="text-[24px]">View All</SpecialText>
            </Link>
          </div>
          <NormalCardCarousal 
            excludeId={product._id} 
            category={product.productCategory}
            limit={8}
          />
        </div>
      </Wrapper>
    </>
  );
};

export default ProductPage;
