import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/Axios/useAxiosSecure";
import { MapPin, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function PathaoShipping({ onPriceCalculated, itemWeight = 0.5 }) {
  const axiosSecure = useAxiosSecure();
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  // Fetch cities
  const { data: citiesData, isLoading: loadingCities } = useQuery({
    queryKey: ["pathao-cities"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/pathao/cities");
      return data?.data?.data || [];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  // Fetch zones when city is selected
  const { data: zonesData, isLoading: loadingZones } = useQuery({
    queryKey: ["pathao-zones", selectedCity],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/pathao/cities/${selectedCity}/zones`
      );
      return data?.data?.data || [];
    },
    enabled: !!selectedCity,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch areas when zone is selected
  const { data: areasData, isLoading: loadingAreas } = useQuery({
    queryKey: ["pathao-areas", selectedZone],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/pathao/zones/${selectedZone}/areas`
      );
      return data?.data?.data || [];
    },
    enabled: !!selectedZone,
    staleTime: 1000 * 60 * 30,
  });

  // Calculate price when area is selected
  const { data: priceData, isLoading: loadingPrice } = useQuery({
    queryKey: ["pathao-price", selectedCity, selectedZone, itemWeight],
    queryFn: async () => {
      const { data } = await axiosSecure.post("/pathao/calculate-price", {
        item_weight: itemWeight,
        recipient_city: selectedCity,
        recipient_zone: selectedZone,
      });
      return data?.data || null;
    },
    enabled: !!selectedCity && !!selectedZone && !!selectedArea,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Reset dependent selections when parent changes
  useEffect(() => {
    setSelectedZone(null);
    setSelectedArea(null);
  }, [selectedCity]);

  useEffect(() => {
    setSelectedArea(null);
  }, [selectedZone]);

  // Memoized callback to prevent infinite loops
  const notifyPriceChange = useCallback(() => {
    if (priceData && onPriceCalculated) {
      onPriceCalculated({
        price: priceData.final_price || priceData.price || 0,
        cityId: selectedCity,
        zoneId: selectedZone,
        areaId: selectedArea,
        priceDetails: priceData,
      });
    }
  }, [priceData, selectedCity, selectedZone, selectedArea]);

  // Notify parent component when price is calculated
  useEffect(() => {
    notifyPriceChange();
  }, [notifyPriceChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-gray-700" />
        <h4 className="font-medium text-gray-800">Delivery Location</h4>
      </div>

      {/* City Selection */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <Select
          value={selectedCity?.toString()}
          onValueChange={(value) => setSelectedCity(parseInt(value))}
          disabled={loadingCities}
        >
          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-black focus:ring-black">
            <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select city"} />
          </SelectTrigger>
          <SelectContent>
            {citiesData?.map((city) => (
              <SelectItem key={city.city_id} value={city.city_id.toString()}>
                {city.city_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zone Selection */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Zone/Area</label>
        <Select
          value={selectedZone?.toString()}
          onValueChange={(value) => setSelectedZone(parseInt(value))}
          disabled={!selectedCity || loadingZones}
        >
          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-black focus:ring-black">
            <SelectValue
              placeholder={
                !selectedCity
                  ? "Select city first"
                  : loadingZones
                  ? "Loading zones..."
                  : "Select zone"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {zonesData?.map((zone) => (
              <SelectItem key={zone.zone_id} value={zone.zone_id.toString()}>
                {zone.zone_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area Selection */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Specific Area</label>
        <Select
          value={selectedArea?.toString()}
          onValueChange={(value) => setSelectedArea(parseInt(value))}
          disabled={!selectedZone || loadingAreas}
        >
          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-black focus:ring-black">
            <SelectValue
              placeholder={
                !selectedZone
                  ? "Select zone first"
                  : loadingAreas
                  ? "Loading areas..."
                  : "Select area"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {areasData?.map((area) => (
              <SelectItem key={area.area_id} value={area.area_id.toString()}>
                {area.area_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Display */}
      {loadingPrice && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-gray-600">Calculating delivery price...</span>
        </div>
      )}

      {priceData && !loadingPrice && (
        <div className="p-3 bg-black/5 rounded-md border border-black/20">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Delivery Charge</span>
            <span className="text-lg font-semibold text-gray-900">
              ৳ {priceData.final_price || priceData.price}
            </span>
          </div>
          {priceData.discount > 0 && (
            <div className="flex justify-between items-center mt-1 text-xs text-gray-600">
              <span>Discount</span>
              <span className="text-green-600">- ৳ {priceData.discount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
