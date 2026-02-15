using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class category_master
{
    public int catmaster_id { get; set; }

    public string category_id { get; set; } = null!;

    public string? subcategory_id { get; set; }

    public string? name { get; set; }

    public string? image_path { get; set; }

    public bool flag { get; set; }

    public virtual ICollection<cost_master> cost_master { get; set; } = new List<cost_master>();

    public virtual ICollection<departure_date_master> departure_date_master { get; set; } = new List<departure_date_master>();

    public virtual ICollection<itinerary_master> itinerary_master { get; set; } = new List<itinerary_master>();

    public virtual ICollection<tour_master> tour_master { get; set; } = new List<tour_master>();
}
