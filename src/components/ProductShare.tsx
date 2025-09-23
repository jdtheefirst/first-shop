"use client";

import { Product } from "@/types/store";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  PinterestShareButton,
  PinterestIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";

export default function ProductShare({
  product,
  url,
}: {
  product: Product;
  url: string;
}) {
  const shareText = `${product.name} - only $${product.price}! 🚀`;

  if (!url) return null;

  return (
    <div className="flex w-full gap-3 items-center py-6 flex-wrap">
      <FacebookShareButton url={url} quote={shareText}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={shareText}
        hashtags={["#Samma store", "Affrodable", `${product.tags}`]}
      >
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={shareText} separator=" - ">
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      <TelegramShareButton url={url} title={shareText}>
        <TelegramIcon size={40} round />
      </TelegramShareButton>
      {/* New suggestions */}
      <LinkedinShareButton url={url} title={shareText}>
        <LinkedinIcon size={40} round />
      </LinkedinShareButton>

      <RedditShareButton url={url} title={shareText}>
        <RedditIcon size={40} round />
      </RedditShareButton>

      <EmailShareButton url={url} subject={shareText} body="Check this out:">
        <EmailIcon size={40} round />
      </EmailShareButton>

      {/* Only if you have product images */}
      {product.images?.[0] && (
        <PinterestShareButton
          url={url}
          media={product.images[0]}
          description={shareText}
        >
          <PinterestIcon size={40} round />
        </PinterestShareButton>
      )}
    </div>
  );
}
