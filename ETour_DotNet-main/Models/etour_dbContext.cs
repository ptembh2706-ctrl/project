using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Etour_Backend_dotnet.Models;

public partial class etour_dbContext : DbContext
{
    public etour_dbContext()
    {
    }

    public etour_dbContext(DbContextOptions<etour_dbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<addon_on_master> addon_on_master { get; set; }

    public virtual DbSet<booking_addon_master> booking_addon_master { get; set; }

    public virtual DbSet<booking_header> booking_header { get; set; }

    public virtual DbSet<category_master> category_master { get; set; }

    public virtual DbSet<cost_master> cost_master { get; set; }

    public virtual DbSet<customer_master> customer_master { get; set; }

    public virtual DbSet<departure_date_master> departure_date_master { get; set; }

    public virtual DbSet<itinerary_master> itinerary_master { get; set; }

    public virtual DbSet<passenger_master> passenger_master { get; set; }

    public virtual DbSet<payment> payment { get; set; }

    public virtual DbSet<tour_addon_master> tour_addon_master { get; set; }

    public virtual DbSet<tour_master> tour_master { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Fallback connection string - update this password to match your MySQL setup
            // WARNING: This is a fallback! Ensure appsettings.json is used in production.
            // optionsBuilder.UseMySql("server=localhost;database=etour_db;user=root;password=root", 
            //     Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.44-mysql"));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<addon_on_master>(entity =>
        {
            entity.HasKey(e => e.addon_id).HasName("PRIMARY");

            entity.Property(e => e.addon_name).HasMaxLength(255);
            entity.Property(e => e.description).HasMaxLength(255);
            entity.Property(e => e.price).HasPrecision(10, 2);
        });

        modelBuilder.Entity<booking_addon_master>(entity =>
        {
            entity.HasKey(e => e.booking_addon_id).HasName("PRIMARY");

            entity.HasIndex(e => e.addon_id, "addon_id");

            entity.HasIndex(e => e.booking_id, "booking_id");

            entity.Property(e => e.addon_amount).HasPrecision(10, 2);

            entity.HasOne(d => d.addon).WithMany(p => p.booking_addon_master)
                .HasForeignKey(d => d.addon_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_addon_master_ibfk_2");

            entity.HasOne(d => d.booking).WithMany(p => p.booking_addon_master)
                .HasForeignKey(d => d.booking_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_addon_master_ibfk_1");
        });

        modelBuilder.Entity<booking_header>(entity =>
        {
            entity.HasKey(e => e.booking_id).HasName("PRIMARY");

            entity.HasIndex(e => e.customer_id, "customer_id");

            entity.HasIndex(e => e.departure_date_id, "departure_date_id");

            entity.HasIndex(e => e.tour_id, "tour_id");

            entity.Property(e => e.booking_status)
                .HasMaxLength(20)
                .HasDefaultValueSql("'PENDING'");
            entity.Property(e => e.tax_amount).HasPrecision(10, 2);
            entity.Property(e => e.total_amount).HasPrecision(10, 2);
            entity.Property(e => e.tour_amount).HasPrecision(10, 2);

            entity.HasOne(d => d.customer).WithMany(p => p.booking_header)
                .HasForeignKey(d => d.customer_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_header_ibfk_1");

            entity.HasOne(d => d.departure_date).WithMany(p => p.booking_header)
                .HasForeignKey(d => d.departure_date_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_header_ibfk_3");

            entity.HasOne(d => d.tour).WithMany(p => p.booking_header)
                .HasForeignKey(d => d.tour_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_header_ibfk_2");
        });

        modelBuilder.Entity<category_master>(entity =>
        {
            entity.HasKey(e => e.catmaster_id).HasName("PRIMARY");

            entity.Property(e => e.category_id).HasMaxLength(10);
            entity.Property(e => e.image_path).HasMaxLength(255);
            entity.Property(e => e.name).HasMaxLength(100);
            entity.Property(e => e.subcategory_id).HasMaxLength(10);
        });

        modelBuilder.Entity<cost_master>(entity =>
        {
            entity.HasKey(e => e.cost_id).HasName("PRIMARY");

            entity.HasIndex(e => e.catmaster_id, "catmaster_id");

            entity.Property(e => e.base_cost).HasPrecision(10, 2);
            entity.Property(e => e.child_with_bed_cost).HasPrecision(10, 2);
            entity.Property(e => e.child_without_bed_cost).HasPrecision(10, 2);
            entity.Property(e => e.extra_person_cost).HasPrecision(10, 2);
            entity.Property(e => e.single_person_cost).HasPrecision(10, 2);

            entity.HasOne(d => d.catmaster).WithMany(p => p.cost_master)
                .HasForeignKey(d => d.catmaster_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("cost_master_ibfk_1");
        });

        modelBuilder.Entity<customer_master>(entity =>
        {
            entity.HasKey(e => e.customer_id).HasName("PRIMARY");

            entity.Property(e => e.address).HasMaxLength(255);
            entity.Property(e => e.city).HasMaxLength(50);
            entity.Property(e => e.email).HasMaxLength(100);
            entity.Property(e => e.mobile_number).HasMaxLength(15);
            entity.Property(e => e.name).HasMaxLength(100);
            entity.Property(e => e.password).HasMaxLength(255);
            entity.Property(e => e.reset_password_token).HasMaxLength(255);
            entity.Property(e => e.reset_password_token_expiry).HasMaxLength(6);
            entity.Property(e => e.role).HasMaxLength(20);
            entity.Property(e => e.state).HasMaxLength(50);
        });

        modelBuilder.Entity<departure_date_master>(entity =>
        {
            entity.HasKey(e => e.departure_date_id).HasName("PRIMARY");

            entity.HasIndex(e => e.catmaster_id, "catmaster_id");

            entity.HasOne(d => d.catmaster).WithMany(p => p.departure_date_master)
                .HasForeignKey(d => d.catmaster_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("departure_date_master_ibfk_1");
        });

        modelBuilder.Entity<itinerary_master>(entity =>
        {
            entity.HasKey(e => e.itinerary_id).HasName("PRIMARY");

            entity.HasIndex(e => e.catmaster_id, "catmaster_id");

            entity.Property(e => e.itinerary_details).HasColumnType("tinytext");

            entity.HasOne(d => d.catmaster).WithMany(p => p.itinerary_master)
                .HasForeignKey(d => d.catmaster_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("itinerary_master_ibfk_1");
        });

        modelBuilder.Entity<passenger_master>(entity =>
        {
            entity.HasKey(e => e.passenger_id).HasName("PRIMARY");

            entity.HasIndex(e => e.booking_id, "booking_id");

            entity.Property(e => e.passenger_amount).HasPrecision(10, 2);
            entity.Property(e => e.passenger_name).HasMaxLength(100);
            entity.Property(e => e.passenger_type).HasMaxLength(30);

            entity.HasOne(d => d.booking).WithMany(p => p.passenger_master)
                .HasForeignKey(d => d.booking_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("passenger_master_ibfk_1");
        });

        modelBuilder.Entity<payment>(entity =>
        {
            entity.HasKey(e => e.payment_id).HasName("PRIMARY");

            entity.HasIndex(e => e.booking_id, "booking_id");

            entity.HasIndex(e => e.transaction_id, "transaction_id").IsUnique();

            entity.Property(e => e.paid_amount).HasPrecision(10, 2);
            entity.Property(e => e.payment_date).HasColumnType("datetime");
            entity.Property(e => e.payment_mode).HasMaxLength(50);
            entity.Property(e => e.payment_status).HasMaxLength(50);
            entity.Property(e => e.razorpay_order_id).HasMaxLength(255);
            entity.Property(e => e.razorpay_payment_id).HasMaxLength(255);
            entity.Property(e => e.razorpay_signature).HasMaxLength(255);

            entity.HasOne(d => d.booking).WithMany(p => p.payment)
                .HasForeignKey(d => d.booking_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("payment_ibfk_1");
        });

        modelBuilder.Entity<tour_addon_master>(entity =>
        {
            entity.HasKey(e => e.tour_addon_id).HasName("PRIMARY");

            entity.HasIndex(e => e.addon_id, "addon_id");

            entity.HasIndex(e => new { e.tour_id, e.addon_id }, "tour_id").IsUnique();

            entity.HasOne(d => d.addon).WithMany(p => p.tour_addon_master)
                .HasForeignKey(d => d.addon_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tour_addon_master_ibfk_2");

            entity.HasOne(d => d.tour).WithMany(p => p.tour_addon_master)
                .HasForeignKey(d => d.tour_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tour_addon_master_ibfk_1");
        });

        modelBuilder.Entity<tour_master>(entity =>
        {
            entity.HasKey(e => e.tour_id).HasName("PRIMARY");

            entity.HasIndex(e => new { e.catmaster_id, e.departure_date_id }, "catmaster_id").IsUnique();

            entity.HasIndex(e => e.departure_date_id, "departure_date_id");

            entity.Property(e => e.description).HasMaxLength(500);

            entity.HasOne(d => d.catmaster).WithMany(p => p.tour_master)
                .HasForeignKey(d => d.catmaster_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tour_master_ibfk_1");

            entity.HasOne(d => d.departure_date).WithMany(p => p.tour_master)
                .HasForeignKey(d => d.departure_date_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tour_master_ibfk_2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
