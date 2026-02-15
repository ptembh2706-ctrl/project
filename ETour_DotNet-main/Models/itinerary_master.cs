using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class itinerary_master
{
    public int itinerary_id { get; set; }

    public int catmaster_id { get; set; }

    public int day_number { get; set; }

    public string itinerary_details { get; set; } = null!;

    public virtual category_master catmaster { get; set; } = null!;
}
