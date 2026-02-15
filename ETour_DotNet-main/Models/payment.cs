using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class payment
{
    public int payment_id { get; set; }

    public int booking_id { get; set; }

    public string transaction_id { get; set; } = null!;

    public DateTime payment_date { get; set; }

    public string payment_mode { get; set; } = null!;

    public string payment_status { get; set; } = null!;

    public decimal paid_amount { get; set; }

    public string? razorpay_order_id { get; set; }

    public string? razorpay_payment_id { get; set; }

    public string? razorpay_signature { get; set; }

    public virtual booking_header booking { get; set; } = null!;
}
