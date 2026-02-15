using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class cost_master
{
    public int cost_id { get; set; }

    public int catmaster_id { get; set; }

    public decimal base_cost { get; set; }

    public decimal single_person_cost { get; set; }

    public decimal extra_person_cost { get; set; }

    public decimal child_with_bed_cost { get; set; }

    public decimal child_without_bed_cost { get; set; }

    public DateOnly valid_from_date { get; set; }

    public DateOnly valid_to_date { get; set; }

    public virtual category_master catmaster { get; set; } = null!;
}
