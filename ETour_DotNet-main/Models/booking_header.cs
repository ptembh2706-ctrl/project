using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class booking_header
{
    public int booking_id { get; set; }

    public DateOnly booking_date { get; set; }

    public int customer_id { get; set; }

    public int tour_id { get; set; }

    public int departure_date_id { get; set; }

    public int total_passengers { get; set; }

    public decimal tour_amount { get; set; }

    public decimal tax_amount { get; set; }

    public decimal total_amount { get; set; }

    public string booking_status { get; set; } = null!;

    public virtual ICollection<booking_addon_master> booking_addon_master { get; set; } = new List<booking_addon_master>();

    public virtual customer_master customer { get; set; } = null!;

    public virtual departure_date_master departure_date { get; set; } = null!;

    public virtual ICollection<passenger_master> passenger_master { get; set; } = new List<passenger_master>();

    public virtual ICollection<payment> payment { get; set; } = new List<payment>();

    public virtual tour_master tour { get; set; } = null!;
}
