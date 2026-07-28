"use client";

import { useQuery } from "@tanstack/react-query";
import { CloudOutlined } from "@ant-design/icons";

interface WeatherWidgetProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export default function WeatherWidget({ location, latitude, longitude }: WeatherWidgetProps) {
  const query = latitude && longitude ? `${latitude},${longitude}` : location.split(",")[0].trim();

  const { data, isLoading } = useQuery({
    queryKey: ["weather", query],
    queryFn: async () => {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(query)}?format=j1`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 min cache
    retry: 1,
  });

  if (isLoading) return <div className="animate-pulse bg-gray-100 rounded-xl h-24" />;
  if (!data?.current_condition?.[0]) return null;

  const weather = data.current_condition[0];
  const temp = weather.temp_C;
  const desc = weather.weatherDesc?.[0]?.value || "Unknown";
  const humidity = weather.humidity;
  const windSpeed = weather.windspeedKmph;
  const icon = weather.weatherIconUrl?.[0]?.value;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center gap-2 mb-2">
        <CloudOutlined className="text-blue-500" />
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Weather</span>
      </div>
      <div className="flex items-center gap-3">
        {icon && <img src={icon} alt={desc} className="w-10 h-10" />}
        <div>
          <div className="text-2xl font-bold text-gray-900">{temp}°C</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        <span>Humidity: {humidity}%</span>
        <span>Wind: {windSpeed} km/h</span>
      </div>
    </div>
  );
}
