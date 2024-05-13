function mapWeatherCodeToIcon(code: number) {
  switch (code) {
    // Code	Description from OpenMeteo
    // 0	Clear sky
    // 1, 2, 3	Mainly clear, partly cloudy, and overcast
    // 45, 48	Fog and depositing rime fog
    // 51, 53, 55	Drizzle: Light, moderate, and dense intensity
    // 56, 57	Freezing Drizzle: Light and dense intensity
    // 61, 63, 65	Rain: Slight, moderate and heavy intensity
    // 66, 67	Freezing Rain: Light and heavy intensity
    // 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
    // 77	Snow grains
    // 80, 81, 82	Rain showers: Slight, moderate, and violent
    // 85, 86	Snow showers slight and heavy
    case 0:
      return "☀️";
    case 1:
    case 2:
    case 3:
      return "⛅";
    case 45:
    case 48:
      return "🌁";
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return "🌧️";
    case 56:
    case 57:
    case 66:
    case 67:
      return "🥶";
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return "❄️";
    default:
      return "❓";
  }
}

export { mapWeatherCodeToIcon };
