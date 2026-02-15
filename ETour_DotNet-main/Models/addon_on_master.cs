using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class addon_on_master
{
    public int addon_id { get; set; }

    public string addon_name { get; set; } = null!;

    public string? description { get; set; }

    public decimal price { get; set; }

    public bool is_active { get; set; }

    public virtual ICollection<booking_addon_master> booking_addon_master { get; set; } = new List<booking_addon_master>();

    public virtual ICollection<tour_addon_master> tour_addon_master { get; set; } = new List<tour_addon_master>();
}
