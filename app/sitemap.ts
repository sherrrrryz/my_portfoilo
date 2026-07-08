import { MetadataRoute } from "next";
import { metaData } from "./lib/config";

const BaseUrl = metaData.baseUrl.endsWith("/")
  ? metaData.baseUrl
  : `${metaData.baseUrl}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];
  return [
    { url: BaseUrl, lastModified: today },
    { url: `${BaseUrl}about`, lastModified: today },
    { url: `${BaseUrl}projects`, lastModified: today },
    { url: `${BaseUrl}projects/lockscreen`, lastModified: today },
    { url: `${BaseUrl}projects/miui-design-system`, lastModified: today },
    { url: `${BaseUrl}projects/touch-hotspots`, lastModified: today },
    { url: `${BaseUrl}projects/applovin-oobe`, lastModified: today },
  ];
}
