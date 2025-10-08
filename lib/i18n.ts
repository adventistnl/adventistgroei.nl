import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Recursos de tradução
const resources = {
  en: {
    translation: {
      dashboard: {
        title: "General Dashboard",
        subtitle: "Overview of key system metrics",
        growth_chart_title: "Growth of Institutions & Churches",
        users_by_institution_chart_title: "User Distribution by Institution",
        financial_chart_title: "Department Budget vs. Subsidy Requests",
        subsidy_status_chart_title: "Subsidy Request Status",
        events_chart_title: "Event Participation by Type",
        communications_chart_title: "Communication & Message Flow",
        recent_activities: "Recent Activities",
        quick_actions: "Quick Actions"
      },
      activities: {
        modal: {
          title: "Activity Details",
          edit_title: "Edit Activity",
          status: "Status",
          priority: "Priority", 
          category: "Category",
          budget: "Budget",
          subsidy: "Subsidy",
          description: "Description",
          documents: "Documents",
          system_info: "System Information",
          created_at: "Created at",
          updated_at: "Updated at",
          created_by: "Created by",
          updated_by: "Updated by",
          activity_id: "Activity ID",
          total_budget: "Total Budget",
          rich_editor: "Rich Editor",
          click_to_edit: "Click to edit description",
          drop_files: "Drop files here or click to upload",
          supported_formats: "Supports PDF and images up to 10MB",
          no_documents: "No documents attached",
          use_button_above: "Use the button above to add documents",
          save_changes: "Save Changes",
          unsaved_changes: "There are unsaved changes",
          close: "Close",
          tooltips: {
            status: "Current activity status",
            priority: "Activity urgency level", 
            category: "Type of activity",
            subsidy: "Whether this activity is subsidized or not"
          },
          status_options: {
            todo: "To Do",
            in_progress: "In Progress", 
            completed: "Completed",
            on_hold: "On Hold"
          },
          priority_options: {
            urgent: "Urgent",
            high: "High",
            medium: "Medium", 
            low: "Low"
          },
          category_options: {
            reforma: "Reform",
            material: "Material",
            training: "Training"
          },
          subsidy_info: {
            subsidized: "This activity is subsidized",
            not_subsidized: "This activity is not subsidized",
            click_to_toggle: "Click to toggle subsidy status"
          },
          delete: {
            title: "Delete Activity",
            description: "This action will permanently delete the activity and all related data.",
            affected_data: "Affected Data",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences of deleting this activity",
            acknowledge_text: "I acknowledge that all activity data and progress will be permanently lost.",
            type_confirmation: "Type \"DELETE ACTIVITY\" to confirm:",
            confirmation_placeholder: "DELETE ACTIVITY",
            confirmation_text: "delete activity",
            confirmation_help: "Type exactly as shown above to enable the delete button",
            delete_activity: "Delete Activity",
            deleting: "Deleting...",
            consequences: {
              data_loss: "Complete Data Loss",
              data_loss_desc: "All activity information, progress tracking, and metadata will be permanently removed.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "The allocated budget will be returned to the project's available funds.",
              progress_loss: "Progress Tracking Loss",
              progress_loss_desc: "All progress tracking, milestones, and completion records will be lost.",
              documentation_loss: "Documentation Loss",
              documentation_loss_desc: "Any attached documents, notes, or related files will be permanently deleted."
            },
            permanent_warning: {
              title: "This is a permanent action",
              description: "Unlike institutions or users, activities cannot be recovered once deleted. All data will be permanently lost."
            }
          }
        },
        subsidized: "Subsidized",
        budget: "Budget",
        priority: "Priority",
        status: "Status",
        subsidy: "Subsidy",
        toasts: {
          deleting: "Deleting activity...",
          deleted: "Activity deleted successfully",
          delete_failed: "Failed to delete activity"
        },
        table: {
          activity: "Activity",
          category: "Category",
          subsidy_status: "Subsidy",
          budget: "Budget",
          status: "Status",
          priority: "Priority",
          actions: "Actions",
          manage_activity: "Manage Activity",
          remove: "Remove",
          subsidized_tab: "Subsidized",
          non_subsidized_tab: "Not Subsidized",
          no_subsidized_found: "No subsidized activities found",
          no_non_subsidized_found: "No non-subsidized activities found",
          adjust_filters: "Adjust the filters to see more activities.",
          create_first_subsidized: "Start by creating the first subsidized activity for the project.",
          create_first_non_subsidized: "Start by creating the first non-subsidized activity for the project.",
          new_activity: "New Activity",
          clear_filters: "Clear Filters",
          filters_cleared: "Filters cleared"
        }
      },
      metrics: {
        total_users: "Total Users",
        total_institutions: "Total Institutions",
        total_churches: "Total Churches",
        pending_subsidies: "Pending Subsidies",
        active_regions: "Active Regions",
        monthly_growth: "Monthly Growth",
        budget_utilization: "Budget Utilization",
        event_participation: "Event Participation"
      },
      common: {
        language: "Language",
        english: "English",
        dutch: "Dutch",
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        filter: "Filter",
        search: "Search",
        export: "Export",
        refresh: "Refresh",
        columns: "Columns",
        clear_filters: "Clear Filters",
        close: "Close",
        upload: "Upload"
      },
      actions: {
        add_member: "Add Member",
        create_event: "Create Event",
        manage_subsidies: "Manage Subsidies",
        view_reports: "View Reports",
        send_communication: "Send Communication",
        manage_departments: "Manage Departments",
        view_details: "View Details",
        create_institution: "Create Institution"
      },
      institutions: {
        title: "Institutions",
        subtitle: "Manage institutions and their relationships",
        overview: "Overview",
        all_institutions: "All Institutions",
        filters: {
          institution: "Institution",
          denomination: "Denomination",
          country: "Country",
          language: "Language"
        },
        kpis: {
          total_institutions: "Total Institutions",
          total_regions: "Total Regions",
          total_churches: "Total Churches",
          total_users: "Total Users",
          total_budget: "Total Budget",
          annual_budget: "Annual Budget",
          pending_subsidies: "Pending Subsidies",
          budget_utilization: "Budget Utilization"
        },
        charts: {
          churches_by_region: "Churches by Region",
          users_by_role: "Users by Role",
          subsidy_over_time: "Subsidy Requests over Time",
          revenue_vs_budget: "Revenue vs Annual Budget",
          monthly_subsidies: "Monthly Subsidy Trends"
        },
        table: {
          name: "Institution Name",
          country: "Country",
          denomination: "Denomination",
          language: "Language",
          churches: "Churches",
          users: "Users",
          members: "Members",
          regions: "Regions",
          budget: "Budget",
          actions: "Actions",
          search_placeholder: "Search institutions...",
          no_results: "No institutions found",
          showing_results: "Showing {{from}} to {{to}} of {{total}} institutions"
        },
        modal: {
          create_title: "Create New Institution",
          edit_title: "Edit Institution",
          basic_info: "Basic Information",
          contact_info: "Contact Information",
          review: "Review",
          name: "Institution Name",
          name_placeholder: "Enter institution name",
          denomination: "Denomination",
          denomination_placeholder: "Select or enter denomination",
          language_preference: "Language Preference",
          country: "Country",
          country_placeholder: "Select country",
          city: "City",
          city_placeholder: "Enter city",
          address: "Address",
          address_placeholder: "Enter full address",
          email: "Email",
          email_placeholder: "Enter contact email",
          phone: "Phone",
          phone_placeholder: "Enter phone number",
          website: "Website",
          website_placeholder: "Enter website URL",
          next: "Next",
          back: "Back",
          create: "Create Institution",
          update: "Update Institution",
          cancel: "Cancel"
        },
        modals: {
          edit: {
            title: "Edit Institution",
            description: "Update institution information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Institution",
            deactivate_description: "This will deactivate the institution and restrict access to all associated users and data.",
            affected_components: "Affected Components",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences of deactivating this institution",
            acknowledge_text: "This action will affect all users, regions, churches, and departments associated with this institution.",
            type_confirmation: "Type 'DELETE INSTITUTION' to confirm:",
            confirmation_placeholder: "DELETE INSTITUTION",
            confirmation_help: "Type exactly as shown above to enable the delete button",
            deactivating: "Deactivating...",
            deactivate_institution: "Deactivate Institution",
            consequences: {
              user_access: "User Access Restriction",
              user_access_desc: "All users associated with this institution will lose access to the system immediately.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All data including subsidies, reports, and communications will be preserved but marked as inactive.",
              organizational_structure: "Organizational Structure",
              organizational_structure_desc: "All regions, churches, and departments will be deactivated but data will remain intact.",
              financial_data: "Financial Records",
              financial_data_desc: "All budget allocations, subsidy requests, and financial reports will be preserved for audit purposes."
            },
            soft_delete: {
              title: "This is a soft deactivation",
              description: "The institution will be marked as inactive but all data will be preserved. This action can be reversed by a system administrator."
            }
          }
        },
        fields: {
          name: "Institution Name",
          denomination: "Denomination",
          language_preference: "Language Preference"
        },
        placeholders: {
          name: "Enter institution name",
          denomination: "Enter denomination",
          language_preference: "Select preferred language"
        },
        validation: {
          name_required: "Institution name is required",
          name_min_length: "Institution name must be at least 2 characters",
          denomination_required: "Denomination is required",
          language_required: "Language preference is required"
        },
        stats: {
          regions: "Regions",
          churches: "Churches",
          departments: "Departments",
          users: "Users"
        },
        saving: "Saving...",
        toasts: {
          loaded: "Institutions data loaded successfully",
          error_loading: "Error loading institutions data",
          institution_details_loaded: "Institution details loaded",
          institution_switched: "Institution filter changed",
          create_success: "Institution created successfully",
          create_error: "Error creating institution",
          update_success: "Institution updated successfully",
          update_error: "Error updating institution",
          delete_success: "Institution deleted successfully",
          delete_error: "Error deleting institution",
          language_switched: "Language switched successfully",
          updating: "Updating institution...",
          updated: "Institution updated successfully",
          update_failed: "Failed to update institution",
          deactivating: "Deactivating institution...",
          deactivated: "Institution deactivated successfully",
          deactivate_failed: "Failed to deactivate institution",
          image_uploading: "Uploading image...",
          image_uploaded: "Image uploaded successfully",
          image_upload_failed: "Failed to upload image",
          image_removing: "Removing image...",
          image_removed: "Image removed successfully",
          image_remove_failed: "Failed to remove image"
        }
      },
      regions: {
        title: "Regions",
        subtitle: "Manage regional divisions and territories",
        modals: {
          create: {
            title: "Add New Region",
            description: "Create a new regional division for your institution"
          },
          edit: {
            title: "Edit Region",
            description: "Update region information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Region",
            deactivate_description: "This will deactivate the region and make it inaccessible to users. The region data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect churches and related data.",
            type_confirmation: "Type 'delete region' to confirm",
            confirmation_placeholder: "delete region",
            confirmation_help: "This action cannot be undone. Type the exact text to confirm.",
            deactivating: "Deactivating...",
            deactivate_region: "Deactivate Region",
            affected_components: "Affected Components",
            consequences: {
              church_access: "Church Access Loss",
              church_access_desc: "Churches in this region will lose access to regional resources and coordination.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All region data, budgets, and church information will be preserved but hidden.",
              member_impact: "Member Impact",
              member_impact_desc: "Regional members will be reassigned to other regions or marked as unassigned.",
              event_impact: "Event Impact",
              event_impact_desc: "Regional events will be cancelled and new events cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The region will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Region Name",
          parent_region: "Parent Region",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter region name",
          parent_region: "Select parent region",
          no_parent: "No parent region (top-level)",
          country: "Select country",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          region: "Region",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Region name is required",
          name_min_length: "Region name must be at least 2 characters",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          churches: "Churches",
          members: "Members",
          budget: "Budget",
          utilization: "Utilization"
        },
        toasts: {
          creating: "Creating region...",
          created: "Region created successfully",
          create_failed: "Failed to create region",
          updating: "Updating region...",
          updated: "Region updated successfully",
          update_failed: "Failed to update region",
          deactivating: "Deactivating region...",
          deactivated: "Region deactivated successfully",
          deactivate_failed: "Failed to deactivate region"
        }
      },
      churches: {
        title: "Churches",
        subtitle: "Manage churches and their organization",
        modals: {
          create: {
            title: "Add New Church",
            description: "Create a new church for your institution"
          },
          edit: {
            title: "Edit Church",
            description: "Update church information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Church",
            deactivate_description: "This will deactivate the church and make it inaccessible to users. The church data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect church members and related data.",
            type_confirmation: "Type 'delete church' to confirm",
            confirmation_placeholder: "delete church",
            confirmation_help: "This action cannot be undone. Type the exact text to confirm.",
            deactivating: "Deactivating...",
            deactivate_church: "Deactivate Church",
            affected_components: "Affected Components",
            consequences: {
              member_access: "Member Access Loss",
              member_access_desc: "Church members will lose access to church resources and activities.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All church data, budgets, and project information will be preserved but hidden.",
              department_impact: "Department Impact",
              department_impact_desc: "Church departments will be deactivated and unavailable for new activities.",
              event_impact: "Event Impact",
              event_impact_desc: "Scheduled events will be cancelled and new events cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The church will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Church Name",
          region: "Region",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter church name",
          region: "Select region",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          church: "Church",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Church name is required",
          name_min_length: "Church name must be at least 2 characters",
          region_required: "Region is required",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          members: "Members",
          departments: "Departments",
          budget: "Budget",
          events: "Events"
        },
        toasts: {
          creating: "Creating church...",
          created: "Church created successfully",
          create_failed: "Failed to create church",
          updating: "Updating church...",
          updated: "Church updated successfully",
          update_failed: "Failed to update church",
          deactivating: "Deactivating church...",
          deactivated: "Church deactivated successfully",
          deactivate_failed: "Failed to deactivate church"
        }
      },
      departments: {
        title: "Departments",
        subtitle: "Manage departments and their organization",
        modals: {
          create: {
            title: "Add New Department",
            description: "Create a new department for your institution"
          },
          edit: {
            title: "Edit Department",
            description: "Update department information and settings"
          },
          delete: {
            deactivate_title: "Deactivate Department",
            deactivate_description: "This will deactivate the department and make it inaccessible to users. The department data will be preserved.",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this action will affect department members and related data.",
            type_confirmation: "Type 'delete department' to confirm",
            confirmation_placeholder: "delete department",
            confirmation_help: "This action cannot be undone. Type the exact text to confirm.",
            deactivating: "Deactivating...",
            deactivate_department: "Deactivate Department",
            affected_components: "Affected Components",
            consequences: {
              member_access: "Member Access Loss",
              member_access_desc: "Department members will lose access to department resources and activities.",
              data_preservation: "Data Preservation",
              data_preservation_desc: "All department data, budgets, and project information will be preserved but hidden.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Department budget allocations will be frozen and unavailable for new projects.",
              project_impact: "Project Impact",
              project_impact_desc: "Active projects will be suspended and new projects cannot be created."
            },
            soft_delete: {
              title: "Soft Delete",
              description: "The department will be deactivated but not permanently deleted. All data will be preserved and can be restored if needed."
            }
          }
        },
        sections: {
          basic_info: "Basic Information",
          contact_info: "Contact Information"
        },
        fields: {
          name: "Department Name",
          church: "Church",
          description: "Description",
          annual_budget: "Annual Budget",
          contact_name: "Contact Name",
          contact_email: "Contact Email",
          contact_phone: "Contact Phone",
          contact_mobile: "Contact Mobile",
          contact_country: "Country",
          contact_city: "City",
          contact_address: "Address",
          contact_postal_code: "Postal Code",
          contact_website: "Website"
        },
        placeholders: {
          name: "Enter department name",
          church: "Select church",
          description: "Enter department description",
          annual_budget: "Enter annual budget amount",
          contact_name: "Enter contact name",
          contact_email: "Enter contact email",
          contact_phone: "Enter phone number",
          contact_mobile: "Enter mobile number",
          contact_country: "Enter country",
          contact_city: "Enter city",
          contact_address: "Enter address",
          contact_postal_code: "Enter postal code",
          contact_website: "https://example.com"
        },
        labels: {
          department: "Department",
          contact: "Contact"
        },
        steps: {
          step: "Step",
          of: "of"
        },
        buttons: {
          next: "Next",
          previous: "Previous"
        },
        validation: {
          name_required: "Department name is required",
          name_min_length: "Department name must be at least 2 characters",
          church_required: "Church is required",
          description_required: "Description is required",
          description_min_length: "Description must be at least 10 characters",
          budget_required: "Annual budget is required and must be greater than 0",
          email_invalid: "Please enter a valid email address",
          please_fix_errors: "Please fix the errors before continuing"
        },
        creating: "Creating...",
        updating: "Updating...",
        stats: {
          church: "Church",
          members: "Members",
          budget: "Budget",
          projects: "Projects"
        },
        toasts: {
          creating: "Creating department...",
          created: "Department created successfully",
          create_failed: "Failed to create department",
          updating: "Updating department...",
          updated: "Department updated successfully",
          update_failed: "Failed to update department",
          deactivating: "Deactivating department...",
          deactivated: "Department deactivated successfully",
          deactivate_failed: "Failed to deactivate department"
        }
      },
      access: {
        title: "Access Management",
        subtitle: "Manage users, roles, and permissions",
        overview: "Access Overview",
        kpis: {
          total_users: "Total Users",
          total_roles: "Total Roles",
          total_permissions: "Total Permissions",
          active_users: "Active Users",
          admin_users: "Admin Users",
          user_growth_rate: "User Growth Rate"
        },
        charts: {
          role_distribution: "Role Distribution",
          permissions_by_group: "Permissions by Group",
          user_activity: "User Activity Over Time"
        },
        tabs: {
          users: "Users",
          roles: "Roles",
          permissions: "Permissions"
        },
        users: {
          title: "User Management",
          subtitle: "Manage system users and their access",
          table: {
            name: "Name",
            email: "Email",
            institution: "Institution",
            church: "Church",
            roles: "Roles",
            created_at: "Created",
            actions: "Actions",
            search_placeholder: "Search users...",
            no_results: "No users found"
          },
          actions: {
            create_user: "Create User",
            view_details: "View Details",
            edit_user: "Edit User",
            assign_role: "Assign Role",
            remove_role: "Remove Role",
            delete_user: "Delete User"
          }
        },
        roles: {
          title: "Role Management",
          subtitle: "Manage roles and their permissions",
          table: {
            name: "Role Name",
            key_code: "Key Code",
            description: "Description",
            permissions_count: "Permissions",
            users_count: "Users",
            actions: "Actions"
          },
          actions: {
            create_role: "Create Role",
            edit_role: "Edit Role",
            edit_permissions: "Edit Permissions",
            duplicate_role: "Duplicate Role",
            delete_role: "Delete Role"
          },
          permissions: {
            title: "Role Permissions Configuration",
            subtitle: "Configure detailed permissions for this role",
            role_info: "Role Information",
            permissions_matrix: "Permissions Matrix",
            select_all: "Select All Permissions",
            select_none: "Clear All Permissions",
            select_group: "Select All in Group",
            clear_group: "Clear Group",
            selected_count: "{{count}} permissions selected",
            total_permissions: "{{total}} total permissions",
            unsaved_changes: "You have unsaved changes",
            groups: {
              USER: "User Management",
              ROLE: "Role Management", 
              PERMISSION: "Permission Management",
              INSTITUTION: "Institution Management",
              REGION: "Region Management",
              CHURCH: "Church Management"
            },
            group_descriptions: {
              USER: "Control user creation, editing, and access management",
              ROLE: "Manage system roles and role assignments",
              PERMISSION: "Configure system-wide permission settings",
              INSTITUTION: "Administer institutions and organizational structure",
              REGION: "Manage regional divisions and territories",
              CHURCH: "Oversee church operations and management"
            }
          }
        },
        permissions: {
          title: "System Permissions",
          subtitle: "View all available system permissions",
          table: {
            name: "Permission Name",
            key_code: "Key Code",
            description: "Description",
            group: "Group"
          }
        },
        modals: {
          create_user: {
            title: "Create New User",
            name: "Full Name",
            email: "Email Address",
            institution: "Institution",
            church: "Church",
            language: "Language Preference",
            roles: "Assign Roles",
            create: "Create User",
            cancel: "Cancel"
          },
          create_role: {
            title: "Create New Role",
            description: "Create a new role with specific permissions for system access",
            name: "Role Name",
            name_placeholder: "Enter role name (e.g., Manager, Editor)",
            key_code: "Key Code",
            key_code_placeholder: "Enter unique key (e.g., MANAGER)",
            description_label: "Description",
            description_placeholder: "Describe what this role can do...",
            permissions_note: "You can assign permissions after creating the role",
            create: "Create Role"
          },
          edit_role: {
            title: "Edit Role",
            description: "Modify role details and manage permissions",
            name: "Role Name",
            key_code: "Key Code",
            description_label: "Description",
            permissions: "Permissions",
            admin_key_locked: "Admin key code cannot be modified for security reasons",
            edit_permissions: "Edit Permissions",
            save: "Save Changes",
            cancel: "Cancel"
          },
          delete_role: {
            title: "Delete Role",
            description: "This action cannot be undone. The role will be permanently deleted.",
            reassign_description: "This role is assigned to users. You must reassign them first.",
            reassign_to: "Reassign users to",
            select_role: "Select a replacement role",
            reassign_warning: "Important: User permissions will change",
            reassign_note: "Users will inherit the permissions of the new role immediately",
            confirm_warning: "Are you absolutely sure?",
            confirm_note: "This role and all its associations will be permanently deleted",
            skip_reassign: "Delete Without Reassigning",
            reassign_and_delete: "Reassign & Delete Role",
            delete: "Delete Role"
          }
        },
        toasts: {
          user_created: "User created successfully",
          user_updated: "User updated successfully",
          user_deleted: "User deleted successfully",
          role_created: "Role created successfully",
          role_updated: "Role updated successfully",
          role_deleted: "Role deleted successfully",
          role_assigned: "Role assigned successfully",
          role_removed: "Role removed successfully",
          permissions_updated: "Permissions updated successfully",
          access_denied: "Access denied - insufficient permissions",
          creating_role: "Creating role...",
          updating_role: "Updating role...",
          deleting_role: "Deleting role...",
          role_create_failed: "Failed to create role",
          role_update_failed: "Failed to update role",
          role_delete_failed: "Failed to delete role"
        }
      },
      users: {
        title: "User Management",
        subtitle: "Manage system users, roles, and permissions",
        overview: "Users Overview",
        kpis: {
          total_users: "Total Users",
          active_users: "Active Users",
          inactive_users: "Inactive Users",
          new_users_month: "New This Month",
          deleted_users: "Deleted Users",
          total_users_description: "All registered users",
          of_total: "of total",
          new_users_month_description: "Recently joined",
          deleted_users_description: "Soft deleted users"
        },
        charts: {
          users_by_role: "Users by Role",
          users_by_role_description: "Role distribution across users",
          users_by_institution: "Users by Institution",
          users_by_institution_description: "User count per institution",
          user_growth: "User Growth",
          user_growth_description: "Monthly user registration trend",
          users_by_region: "Users by Region",
          users_by_region_description: "Regional user distribution",
          users_by_department: "Users by Department",
          users_by_department_description: "Department user allocation"
        },
        table: {
          title: "All Users",
          description: "Manage and view all system users",
          total_found: "users found",
          avatar: "Avatar",
          name: "Name",
          email: "Email",
          language: "Language",
          institution: "Institution",
          church: "Church",
          department: "Department",
          roles: "Roles",
          status: "Status",
          actions: "Actions",
          search_placeholder: "Search users...",
          no_results: "No users found",
          active: "Active",
          inactive: "Inactive"
        },
        actions: {
          create_user: "Create User",
          edit_user: "Edit User",
          delete_user: "Delete User",
          view_details: "View Details",
          assign_roles: "Assign Roles",
          activate_user: "Activate User",
          deactivate_user: "Deactivate User"
        },
        modals: {
          create_user: {
            title: "Create New User",
            description: "Add a new user to the system",
            name: "Full Name",
            name_placeholder: "Enter user's full name",
            email: "Email Address",
            email_placeholder: "Enter email address",
            language: "Language Preference",
            institution: "Institution",
            church: "Church",
            region: "Region",
            department: "Department (Optional)",
            roles: "Assign Roles",
            status: "User Status",
            create: "Create User",
            cancel: "Cancel"
          },
          edit_user: {
            title: "Edit User",
            description: "Modify user information and settings",
            save: "Save Changes"
          },
          delete_user: {
            title: "Delete User",
            description: "This action cannot be undone. The user will be soft deleted.",
            confirm_warning: "Are you sure you want to delete this user?",
            confirm_note: "The user will be deactivated and marked as deleted",
            delete: "Delete User",
            deactivate_title: "Deactivate User Access",
            deactivate_description: "This action will remove the user's access to the system while preserving all data",
            view_consequences: "View Consequences",
            understand_consequences: "I understand the consequences",
            acknowledge_text: "I acknowledge that this user will lose access to the system and all associated privileges",
            type_confirmation: "Type \"DELETE USER\" to confirm this action:",
            confirmation_placeholder: "DELETE USER",
            confirmation_help: "This confirmation ensures you understand the action being performed",
            deactivate_user: "Deactivate User",
            deactivating: "Deactivating...",
            consequences: {
              login_access: "Login Access Revoked",
              login_access_desc: "User will no longer be able to authenticate or access the system",
              data_preservation: "Data Preservation", 
              data_preservation_desc: "All historical records, subsidies, and reports will be preserved",
              role_assignments: "Role Assignments",
              role_assignments_desc: "All role assignments will be suspended but can be restored"
            },
            soft_delete: {
              title: "Soft Delete Operation",
              description: "This is a reversible operation. The user account will be marked as inactive, preventing system access while maintaining all data integrity. The account can be reactivated at any time by an administrator."
            }
          },
          user_details: {
            title: "User Details",
            description: "Complete user information and history",
            basic_info: "Basic Information",
            contact_info: "Contact Information",
            system_info: "System Information",
            roles_permissions: "Roles & Permissions",
            history: "History"
          }
        },
        toasts: {
          user_created: "User created successfully",
          user_updated: "User updated successfully",
          user_deleted: "User deleted successfully",
          user_activated: "User activated successfully",
          user_deactivated: "User deactivated successfully",
          role_assigned: "Role assigned successfully",
          role_removed: "Role removed successfully",
          creating_user: "Creating user...",
          updating_user: "Updating user...",
          deleting_user: "Deleting user...",
          user_create_failed: "Failed to create user",
          user_update_failed: "Failed to update user",
          user_delete_failed: "Failed to delete user"
        },
        profile: {
          title: "User Profile",
          subtitle: "Complete user information and activity overview",
          analytics: {
            title: "Activity Analytics",
            subtitle: "Track user activity trends over time",
            subsidy_trends: "Subsidy Request Trends",
            subsidy_description: "Monthly subsidy request activity",
            event_trends: "Event Participation Trends", 
            event_description: "Monthly event registration and attendance",
            report_trends: "Report Submission Trends",
            report_description: "Quarterly and annual report submissions",
            communication_trends: "Communication Activity Trends",
            communication_description: "Monthly communication patterns"
          },
          sections: {
            personal_info: "Personal Information",
            system_access: "System Access",
            quick_actions: "Quick Actions",
            recent_activity: "Recent Activity",
            organizational_context: "Organizational Context"
          },
          stats: {
            subsidies: "Subsidies",
            events: "Events", 
            communications: "Communications",
            reports: "Reports",
            total_requests: "Total Requests",
            approved: "Approved",
            registered: "Registered",
            upcoming: "Upcoming",
            total: "Total",
            authored: "Authored",
            annual_reports: "Annual Reports",
            department: "Department"
          },
          actions: {
            send_message: "Send Message",
            view_subsidies: "View Subsidies",
            view_events: "View Events", 
            view_communications: "View Communications",
            view_reports: "View Reports",
            view_contact: "View Contact",
            edit_user: "Edit User",
            delete_user: "Delete User",
            back_to_users: "Back to Users"
          },
          tabs: {
            subsidies: "Subsidies",
            events: "Events",
            reports: "Reports",
            communications: "Communications"
          },
          tables: {
            recent_subsidies: "Recent Subsidy Requests",
            recent_events: "Recent Event Registrations",
            recent_reports: "Recent Report Submissions", 
            recent_communications: "Recent Communications",
            description: "Description",
            amount: "Amount",
            status: "Status",
            date: "Date",
            event: "Event",
            type: "Type",
            title: "Title",
            priority: "Priority",
            report_id: "Report ID",
            department: "Department",
            no_data: "No data found"
          },
          contact: {
            title: "Contact Information",
            description: "Contact details for",
            primary_contact: "Primary Contact",
            address: "Address",
            primary_email: "Primary Email",
            primary_phone: "Primary Phone",
            mobile: "Mobile",
            website: "Website",
            notes: "Notes",
            close: "Close"
          },
          message: {
            title: "Send Direct Message",
            description: "Send a direct message to",
            subject: "Subject",
            message: "Message",
            subject_placeholder: "Message subject...",
            message_placeholder: "Type your message...",
            cancel: "Cancel",
            send: "Send Message"
          },
          annual_report: {
            title: "Annual Subsidy Report",
            description: "Comprehensive overview of subsidy requests and utilization",
            total_requested: "Total Requested",
            approved_amount: "Approved Amount", 
            utilization_rate: "Utilization Rate",
            pending_requests: "Pending Requests"
          }
        },
        chat: {
          no_messages_title: "No messages yet",
          no_messages_description: "Start a conversation with {name} by sending a message below",
          quick_templates: "Quick message templates",
          message_placeholder: "Type your message here...",
          send_hint: "Press Ctrl+Enter to send",
          sending_message: "Sending message...",
          message_sent: "Message sent successfully",
          send_failed: "Failed to send message",
          errors: {
            empty_message: "Please enter a message",
            file_too_large: "File is too large. Maximum size is 10MB"
          },
          templates: {
            meeting_request: "Meeting Request",
            subsidy_follow_up: "Subsidy Follow-up", 
            event_invitation: "Event Invitation",
            document_request: "Document Request"
          },
          attachments: "Attachments",
          drop_files: "Drop files to attach",
          status: {
            sent: "Sent",
            delivered: "Delivered",
            read: "Read",
            online: "Online",
            offline: "Offline"
          }
        }
      }
    }
  },
  nl: {
    translation: {
      dashboard: {
        title: "Algemeen Dashboard",
        subtitle: "Overzicht van belangrijke systeemstatistieken",
        growth_chart_title: "Groei van Instellingen & Kerken",
        users_by_institution_chart_title: "Gebruikersdistributie per Instelling",
        financial_chart_title: "Departementbudget vs. Subsidieaanvragen",
        subsidy_status_chart_title: "Status Subsidieaanvragen",
        events_chart_title: "Evenementdeelname per Type",
        communications_chart_title: "Communicatie & Berichtenstroom",
        recent_activities: "Recente Activiteiten",
        quick_actions: "Snelle Acties"
      },
      activities: {
        modal: {
          title: "Activiteitdetails",
          edit_title: "Activiteit Bewerken",
          status: "Status",
          priority: "Prioriteit", 
          category: "Categorie",
          budget: "Budget",
          subsidy: "Subsidie",
          description: "Beschrijving",
          documents: "Documenten",
          system_info: "Systeeminformatie",
          created_at: "Aangemaakt op",
          updated_at: "Bijgewerkt op",
          created_by: "Aangemaakt door",
          updated_by: "Bijgewerkt door",
          activity_id: "Activiteit ID",
          total_budget: "Totaal Budget",
          rich_editor: "Rijke Editor",
          click_to_edit: "Klik om beschrijving te bewerken",
          drop_files: "Sleep bestanden hier of klik om te uploaden",
          supported_formats: "Ondersteunt PDF en afbeeldingen tot 10MB",
          no_documents: "Geen documenten bijgevoegd",
          use_button_above: "Gebruik de knop hierboven om documenten toe te voegen",
          save_changes: "Wijzigingen Opslaan",
          unsaved_changes: "Er zijn niet-opgeslagen wijzigingen",
          close: "Sluiten",
          tooltips: {
            status: "Huidige activiteitstatus",
            priority: "Urgentieniveau van activiteit", 
            category: "Type activiteit",
            subsidy: "Of deze activiteit gesubsidieerd is of niet"
          },
          status_options: {
            todo: "Te Doen",
            in_progress: "In Uitvoering", 
            completed: "Voltooid",
            on_hold: "In Wacht"
          },
          priority_options: {
            urgent: "Urgent",
            high: "Hoog",
            medium: "Gemiddeld", 
            low: "Laag"
          },
          category_options: {
            reforma: "Hervorming",
            material: "Materiaal",
            training: "Training"
          },
          subsidy_info: {
            subsidized: "Deze activiteit wordt gesubsidieerd",
            not_subsidized: "Deze activiteit wordt niet gesubsidieerd",
            click_to_toggle: "Klik om subsidiestatus te wisselen"
          },
          delete: {
            title: "Activiteit Verwijderen",
            description: "Deze actie zal de activiteit en alle gerelateerde gegevens permanent verwijderen.",
            affected_data: "Beïnvloede Gegevens",
            view_consequences: "Gevolgen Bekijken",
            understand_consequences: "Ik begrijp de gevolgen van het verwijderen van deze activiteit",
            acknowledge_text: "Ik bevestig dat alle activiteitsgegevens en voortgang permanent verloren gaan.",
            type_confirmation: "Typ \"DELETE ACTIVITY\" om te bevestigen:",
            confirmation_placeholder: "DELETE ACTIVITY",
            confirmation_text: "delete activity",
            confirmation_help: "Typ exact zoals hierboven weergegeven om de verwijderknop in te schakelen",
            delete_activity: "Activiteit Verwijderen",
            deleting: "Verwijderen...",
            consequences: {
              data_loss: "Volledig Gegevensverlies",
              data_loss_desc: "Alle activiteitsinformatie, voortgangsregistratie en metadata worden permanent verwijderd.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Het toegewezen budget wordt teruggegeven aan de beschikbare fondsen van het project.",
              progress_loss: "Voortgangsregistratie Verlies",
              progress_loss_desc: "Alle voortgangsregistratie, mijlpalen en voltooiingsrecords gaan verloren.",
              documentation_loss: "Documentatie Verlies",
              documentation_loss_desc: "Alle bijgevoegde documenten, notities of gerelateerde bestanden worden permanent verwijderd."
            },
            permanent_warning: {
              title: "Dit is een permanente actie",
              description: "In tegenstelling tot instellingen of gebruikers kunnen activiteiten niet worden hersteld zodra ze zijn verwijderd. Alle gegevens gaan permanent verloren."
            }
          }
        },
        subsidized: "Gesubsidieerd",
        budget: "Budget",
        priority: "Prioriteit",
        status: "Status",
        subsidy: "Subsidie",
        toasts: {
          deleting: "Activiteit verwijderen...",
          deleted: "Activiteit succesvol verwijderd",
          delete_failed: "Kon activiteit niet verwijderen"
        },
        table: {
          activity: "Activiteit",
          category: "Categorie",
          subsidy_status: "Subsidie",
          budget: "Budget",
          status: "Status",
          priority: "Prioriteit",
          actions: "Acties",
          manage_activity: "Activiteit Beheren",
          remove: "Verwijderen",
          subsidized_tab: "Gesubsidieerd",
          non_subsidized_tab: "Niet Gesubsidieerd",
          no_subsidized_found: "Geen gesubsidieerde activiteiten gevonden",
          no_non_subsidized_found: "Geen niet-gesubsidieerde activiteiten gevonden",
          adjust_filters: "Pas de filters aan om meer activiteiten te zien.",
          create_first_subsidized: "Begin met het maken van de eerste gesubsidieerde activiteit voor het project.",
          create_first_non_subsidized: "Begin met het maken van de eerste niet-gesubsidieerde activiteit voor het project.",
          new_activity: "Nieuwe Activiteit",
          clear_filters: "Filters Wissen",
          filters_cleared: "Filters gewist"
        }
      },
      metrics: {
        total_users: "Totaal Gebruikers",
        total_institutions: "Totaal Instellingen",
        total_churches: "Totaal Kerken",
        pending_subsidies: "Wachtende Subsidies",
        active_regions: "Actieve Regio's",
        monthly_growth: "Maandelijkse Groei",
        budget_utilization: "Budgetbenutting",
        event_participation: "Evenementdeelname"
      },
      common: {
        language: "Taal",
        english: "Engels",
        dutch: "Nederlands",
        loading: "Laden...",
        error: "Er is een fout opgetreden",
        success: "Succes",
        cancel: "Annuleren",
        save: "Opslaan",
        edit: "Bewerken",
        delete: "Verwijderen",
        view: "Bekijken",
        filter: "Filter",
        search: "Zoeken",
        export: "Exporteren",
        refresh: "Vernieuwen",
        columns: "Kolommen",
        clear_filters: "Filters Wissen",
        close: "Sluiten",
        upload: "Uploaden"
      },
      actions: {
        add_member: "Lid Toevoegen",
        create_event: "Evenement Maken",
        manage_subsidies: "Subsidies Beheren",
        view_reports: "Rapporten Bekijken",
        send_communication: "Communicatie Versturen",
        manage_departments: "Afdelingen Beheren",
        view_details: "Details Bekijken",
        create_institution: "Instelling Maken"
      },
      institutions: {
        title: "Instellingen",
        subtitle: "Beheer instellingen en hun relaties",
        overview: "Overzicht",
        all_institutions: "Alle Instellingen",
        filters: {
          institution: "Instelling",
          denomination: "Denominatie",
          country: "Land",
          language: "Taal"
        },
        kpis: {
          total_institutions: "Totaal Instellingen",
          total_regions: "Totaal Regio's",
          total_churches: "Totaal Kerken",
          total_users: "Totaal Gebruikers",
          total_budget: "Totaal Budget",
          annual_budget: "Jaarlijks Budget",
          pending_subsidies: "Wachtende Subsidies",
          budget_utilization: "Budgetbenutting"
        },
        charts: {
          churches_by_region: "Kerken per Regio",
          users_by_role: "Gebruikers per Rol",
          subsidy_over_time: "Subsidieaanvragen in de Tijd",
          revenue_vs_budget: "Inkomsten vs Jaarlijks Budget",
          monthly_subsidies: "Maandelijkse Subsidietrends"
        },
        table: {
          name: "Naam Instelling",
          country: "Land",
          denomination: "Denominatie",
          language: "Taal",
          churches: "Kerken",
          users: "Gebruikers",
          members: "Leden",
          regions: "Regio's",
          budget: "Budget",
          actions: "Acties",
          search_placeholder: "Zoek instellingen...",
          no_results: "Geen instellingen gevonden",
          showing_results: "{{from}} tot {{to}} van {{total}} instellingen weergegeven"
        },
        modal: {
          create_title: "Nieuwe Instelling Maken",
          edit_title: "Instelling Bewerken",
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie",
          review: "Beoordeling",
          name: "Naam Instelling",
          name_placeholder: "Voer naam instelling in",
          denomination: "Denominatie",
          denomination_placeholder: "Selecteer of voer denominatie in",
          language_preference: "Taalvoorkeur",
          country: "Land",
          country_placeholder: "Selecteer land",
          city: "Stad",
          city_placeholder: "Voer stad in",
          address: "Adres",
          address_placeholder: "Voer volledig adres in",
          email: "E-mail",
          email_placeholder: "Voer contact e-mail in",
          phone: "Telefoon",
          phone_placeholder: "Voer telefoonnummer in",
          website: "Website",
          website_placeholder: "Voer website URL in",
          next: "Volgende",
          back: "Terug",
          create: "Instelling Maken",
          update: "Instelling Bijwerken",
          cancel: "Annuleren"
        },
        modals: {
          edit: {
            title: "Instelling Bewerken",
            description: "Werk instellingsinformatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Instelling Deactiveren",
            deactivate_description: "Dit zal de instelling deactiveren en de toegang tot alle bijbehorende gebruikers en gegevens beperken.",
            affected_components: "Getroffen Componenten",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen van het deactiveren van deze instelling",
            acknowledge_text: "Deze actie zal alle gebruikers, regio's, kerken en afdelingen die bij deze instelling horen beïnvloeden.",
            type_confirmation: "Typ 'DELETE INSTITUTION' om te bevestigen:",
            confirmation_placeholder: "DELETE INSTITUTION",
            confirmation_help: "Typ exact zoals hierboven getoond om de verwijderknop in te schakelen",
            deactivating: "Deactiveren...",
            deactivate_institution: "Instelling Deactiveren",
            consequences: {
              user_access: "Gebruikerstoegang Beperking",
              user_access_desc: "Alle gebruikers die bij deze instelling horen verliezen onmiddellijk toegang tot het systeem.",
              data_preservation: "Gegevensbehoud",
              data_preservation_desc: "Alle gegevens inclusief subsidies, rapporten en communicatie worden bewaard maar gemarkeerd als inactief.",
              organizational_structure: "Organisatiestructuur",
              organizational_structure_desc: "Alle regio's, kerken en afdelingen worden gedeactiveerd maar gegevens blijven intact.",
              financial_data: "Financiële Gegevens",
              financial_data_desc: "Alle budgettoewijzingen, subsidieaanvragen en financiële rapporten worden bewaard voor auditdoeleinden."
            },
            soft_delete: {
              title: "Dit is een zachte deactivatie",
              description: "De instelling wordt gemarkeerd als inactief maar alle gegevens worden bewaard. Deze actie kan worden teruggedraaid door een systeembeheerder."
            }
          }
        },
        fields: {
          name: "Naam Instelling",
          denomination: "Denominatie",
          language_preference: "Taalvoorkeur"
        },
        placeholders: {
          name: "Voer naam instelling in",
          denomination: "Voer denominatie in",
          language_preference: "Selecteer voorkeurstaal"
        },
        validation: {
          name_required: "Naam instelling is verplicht",
          name_min_length: "Naam instelling moet minimaal 2 karakters zijn",
          denomination_required: "Denominatie is verplicht",
          language_required: "Taalvoorkeur is verplicht"
        },
        stats: {
          regions: "Regio's",
          churches: "Kerken",
          departments: "Afdelingen",
          users: "Gebruikers"
        },
        saving: "Opslaan...",
        toasts: {
          loaded: "Instellingsgegevens succesvol geladen",
          error_loading: "Fout bij laden van instellingsgegevens",
          institution_details_loaded: "Instellingsdetails geladen",
          institution_switched: "Instellingsfilter gewijzigd",
          create_success: "Instelling succesvol aangemaakt",
          create_error: "Fout bij aanmaken instelling",
          update_success: "Instelling succesvol bijgewerkt",
          update_error: "Fout bij bijwerken instelling",
          delete_success: "Instelling succesvol verwijderd",
          delete_error: "Fout bij verwijderen instelling",
          language_switched: "Taal succesvol gewijzigd",
          updating: "Instelling bijwerken...",
          updated: "Instelling succesvol bijgewerkt",
          update_failed: "Kon instelling niet bijwerken",
          deactivating: "Instelling deactiveren...",
          deactivated: "Instelling succesvol gedeactiveerd",
          deactivate_failed: "Kon instelling niet deactiveren",
          image_uploading: "Afbeelding uploaden...",
          image_uploaded: "Afbeelding succesvol geüpload",
          image_upload_failed: "Kon afbeelding niet uploaden",
          image_removing: "Afbeelding verwijderen...",
          image_removed: "Afbeelding succesvol verwijderd",
          image_remove_failed: "Kon afbeelding niet verwijderen"
        }
      },
      regions: {
        title: "Regio's",
        subtitle: "Beheer regionale divisies en gebieden",
        modals: {
          create: {
            title: "Nieuwe Regio Toevoegen",
            description: "Maak een nieuwe regionale divisie voor uw instelling"
          },
          edit: {
            title: "Regio Bewerken",
            description: "Werk regio informatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Regio Deactiveren",
            deactivate_description: "Dit zal de regio deactiveren en ontoegankelijk maken voor gebruikers. De regio gegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie kerken en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete region' om te bevestigen",
            confirmation_placeholder: "delete region",
            confirmation_help: "Deze actie kan niet ongedaan worden gemaakt. Typ de exacte tekst om te bevestigen.",
            deactivating: "Deactiveren...",
            deactivate_region: "Regio Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              church_access: "Verlies van Kerk Toegang",
              church_access_desc: "Kerken in deze regio verliezen toegang tot regionale bronnen en coördinatie.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle regio gegevens, budgetten en kerk informatie worden bewaard maar verborgen.",
              member_impact: "Leden Impact",
              member_impact_desc: "Regionale leden worden hertoegewezen aan andere regio's of gemarkeerd als niet-toegewezen.",
              event_impact: "Evenement Impact",
              event_impact_desc: "Regionale evenementen worden geannuleerd en nieuwe evenementen kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De regio wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Regio",
          parent_region: "Bovenliggende Regio",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam regio in",
          parent_region: "Selecteer bovenliggende regio",
          no_parent: "Geen bovenliggende regio (topniveau)",
          country: "Selecteer land",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          region: "Regio",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam regio is verplicht",
          name_min_length: "Naam regio moet minimaal 2 karakters zijn",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          churches: "Kerken",
          members: "Leden",
          budget: "Budget",
          utilization: "Benutting"
        },
        toasts: {
          creating: "Regio aanmaken...",
          created: "Regio succesvol aangemaakt",
          create_failed: "Kon regio niet aanmaken",
          updating: "Regio bijwerken...",
          updated: "Regio succesvol bijgewerkt",
          update_failed: "Kon regio niet bijwerken",
          deactivating: "Regio deactiveren...",
          deactivated: "Regio succesvol gedeactiveerd",
          deactivate_failed: "Kon regio niet deactiveren"
        }
      },
      churches: {
        title: "Kerken",
        subtitle: "Beheer kerken en hun organisatie",
        modals: {
          create: {
            title: "Nieuwe Kerk Toevoegen",
            description: "Maak een nieuwe kerk voor uw instelling"
          },
          edit: {
            title: "Kerk Bewerken",
            description: "Werk kerk informatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Kerk Deactiveren",
            deactivate_description: "Dit zal de kerk deactiveren en ontoegankelijk maken voor gebruikers. De kerk gegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie kerkleden en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete church' om te bevestigen",
            confirmation_placeholder: "delete church",
            confirmation_help: "Deze actie kan niet ongedaan worden gemaakt. Typ de exacte tekst om te bevestigen.",
            deactivating: "Deactiveren...",
            deactivate_church: "Kerk Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              member_access: "Verlies van Leden Toegang",
              member_access_desc: "Kerk leden verliezen toegang tot kerk bronnen en activiteiten.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle kerk gegevens, budgetten en projectinformatie worden bewaard maar verborgen.",
              department_impact: "Afdeling Impact",
              department_impact_desc: "Kerk afdelingen worden gedeactiveerd en niet beschikbaar voor nieuwe activiteiten.",
              event_impact: "Evenement Impact",
              event_impact_desc: "Geplande evenementen worden geannuleerd en nieuwe evenementen kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De kerk wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Kerk",
          region: "Regio",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam kerk in",
          region: "Selecteer regio",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          church: "Kerk",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam kerk is verplicht",
          name_min_length: "Naam kerk moet minimaal 2 karakters zijn",
          region_required: "Regio is verplicht",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          members: "Leden",
          departments: "Afdelingen",
          budget: "Budget",
          events: "Evenementen"
        },
        toasts: {
          creating: "Kerk aanmaken...",
          created: "Kerk succesvol aangemaakt",
          create_failed: "Kon kerk niet aanmaken",
          updating: "Kerk bijwerken...",
          updated: "Kerk succesvol bijgewerkt",
          update_failed: "Kon kerk niet bijwerken",
          deactivating: "Kerk deactiveren...",
          deactivated: "Kerk succesvol gedeactiveerd",
          deactivate_failed: "Kon kerk niet deactiveren"
        }
      },
      departments: {
        title: "Afdelingen",
        subtitle: "Beheer afdelingen en hun organisatie",
        modals: {
          create: {
            title: "Nieuwe Afdeling Toevoegen",
            description: "Maak een nieuwe afdeling voor uw instelling"
          },
          edit: {
            title: "Afdeling Bewerken",
            description: "Werk afdelingsinformatie en instellingen bij"
          },
          delete: {
            deactivate_title: "Afdeling Deactiveren",
            deactivate_description: "Dit zal de afdeling deactiveren en ontoegankelijk maken voor gebruikers. De afdelingsgegevens worden bewaard.",
            view_consequences: "Bekijk Gevolgen",
            understand_consequences: "Ik begrijp de gevolgen",
            acknowledge_text: "Ik erken dat deze actie afdelingsleden en gerelateerde gegevens zal beïnvloeden.",
            type_confirmation: "Typ 'delete department' om te bevestigen",
            confirmation_placeholder: "delete department",
            confirmation_help: "Deze actie kan niet ongedaan worden gemaakt. Typ de exacte tekst om te bevestigen.",
            deactivating: "Deactiveren...",
            deactivate_department: "Afdeling Deactiveren",
            affected_components: "Getroffen Componenten",
            consequences: {
              member_access: "Verlies van Leden Toegang",
              member_access_desc: "Afdeling leden verliezen toegang tot afdelingsbronnen en activiteiten.",
              data_preservation: "Gegevens Bewaring",
              data_preservation_desc: "Alle afdelingsgegevens, budgetten en projectinformatie worden bewaard maar verborgen.",
              budget_impact: "Budget Impact",
              budget_impact_desc: "Afdeling budget toewijzingen worden bevroren en niet beschikbaar voor nieuwe projecten.",
              project_impact: "Project Impact",
              project_impact_desc: "Actieve projecten worden opgeschort en nieuwe projecten kunnen niet worden aangemaakt."
            },
            soft_delete: {
              title: "Zachte Verwijdering",
              description: "De afdeling wordt gedeactiveerd maar niet permanent verwijderd. Alle gegevens worden bewaard en kunnen indien nodig worden hersteld."
            }
          }
        },
        sections: {
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie"
        },
        fields: {
          name: "Naam Afdeling",
          church: "Kerk",
          description: "Beschrijving",
          annual_budget: "Jaarlijks Budget",
          contact_name: "Contactnaam",
          contact_email: "Contact E-mail",
          contact_phone: "Contact Telefoon",
          contact_mobile: "Contact Mobiel",
          contact_country: "Land",
          contact_city: "Stad",
          contact_address: "Adres",
          contact_postal_code: "Postcode",
          contact_website: "Website"
        },
        placeholders: {
          name: "Voer naam afdeling in",
          church: "Selecteer kerk",
          description: "Voer beschrijving afdeling in",
          annual_budget: "Voer jaarlijks budget bedrag in",
          contact_name: "Voer contactnaam in",
          contact_email: "Voer contact e-mail in",
          contact_phone: "Voer telefoonnummer in",
          contact_mobile: "Voer mobiel nummer in",
          contact_country: "Voer land in",
          contact_city: "Voer stad in",
          contact_address: "Voer adres in",
          contact_postal_code: "Voer postcode in",
          contact_website: "https://voorbeeld.com"
        },
        labels: {
          department: "Afdeling",
          contact: "Contact"
        },
        steps: {
          step: "Stap",
          of: "van"
        },
        buttons: {
          next: "Volgende",
          previous: "Vorige"
        },
        validation: {
          name_required: "Naam afdeling is verplicht",
          name_min_length: "Naam afdeling moet minimaal 2 karakters zijn",
          church_required: "Kerk is verplicht",
          description_required: "Beschrijving is verplicht",
          description_min_length: "Beschrijving moet minimaal 10 karakters zijn",
          budget_required: "Jaarlijks budget is verplicht en moet groter zijn dan 0",
          email_invalid: "Voer een geldig e-mailadres in",
          please_fix_errors: "Los de fouten op voordat u doorgaat"
        },
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        stats: {
          church: "Kerk",
          members: "Leden",
          budget: "Budget",
          projects: "Projecten"
        },
        toasts: {
          creating: "Afdeling aanmaken...",
          created: "Afdeling succesvol aangemaakt",
          create_failed: "Kon afdeling niet aanmaken",
          updating: "Afdeling bijwerken...",
          updated: "Afdeling succesvol bijgewerkt",
          update_failed: "Kon afdeling niet bijwerken",
          deactivating: "Afdeling deactiveren...",
          deactivated: "Afdeling succesvol gedeactiveerd",
          deactivate_failed: "Kon afdeling niet deactiveren"
        }
      },
      access: {
        title: "Toegangsbeheer",
        subtitle: "Beheer gebruikers, rollen en machtigingen",
        overview: "Toegangsoverzicht",
        kpis: {
          total_users: "Totaal Gebruikers",
          total_roles: "Totaal Rollen",
          total_permissions: "Totaal Machtigingen",
          active_users: "Actieve Gebruikers",
          admin_users: "Admin Gebruikers",
          user_growth_rate: "Gebruikersgroei"
        },
        charts: {
          role_distribution: "Rolverdeling",
          permissions_by_group: "Machtigingen per Groep",
          user_activity: "Gebruikersactiviteit in de Tijd"
        },
        tabs: {
          users: "Gebruikers",
          roles: "Rollen",
          permissions: "Machtigingen"
        },
        users: {
          title: "Gebruikersbeheer",
          subtitle: "Beheer systeemgebruikers en hun toegang",
          table: {
            name: "Naam",
            email: "E-mail",
            institution: "Instelling",
            church: "Kerk",
            roles: "Rollen",
            created_at: "Aangemaakt",
            actions: "Acties",
            search_placeholder: "Zoek gebruikers...",
            no_results: "Geen gebruikers gevonden"
          },
          actions: {
            create_user: "Gebruiker Aanmaken",
            view_details: "Details Bekijken",
            edit_user: "Gebruiker Bewerken",
            assign_role: "Rol Toewijzen",
            remove_role: "Rol Verwijderen",
            delete_user: "Gebruiker Verwijderen"
          }
        },
        roles: {
          title: "Rollenbeheer",
          subtitle: "Beheer rollen en hun machtigingen",
          table: {
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            permissions_count: "Machtigingen",
            users_count: "Gebruikers",
            actions: "Acties"
          },
          actions: {
            create_role: "Rol Aanmaken",
            edit_role: "Rol Bewerken",
            edit_permissions: "Machtigingen Bewerken",
            duplicate_role: "Rol Dupliceren",
            delete_role: "Rol Verwijderen"
          },
          permissions: {
            title: "Rolmachtigingen Configuratie",
            subtitle: "Configureer gedetailleerde machtigingen voor deze rol",
            role_info: "Rolinformatie",
            permissions_matrix: "Machtigingenmatrix",
            select_all: "Alle Machtigingen Selecteren",
            select_none: "Alle Machtigingen Wissen",
            select_group: "Alles in Groep Selecteren",
            clear_group: "Groep Wissen",
            selected_count: "{{count}} machtigingen geselecteerd",
            total_permissions: "{{total}} totale machtigingen",
            unsaved_changes: "U heeft niet-opgeslagen wijzigingen",
            groups: {
              USER: "Gebruikersbeheer",
              ROLE: "Rollenbeheer",
              PERMISSION: "Machtigingenbeheer",
              INSTITUTION: "Instellingsbeheer",
              REGION: "Regiobeheer",
              CHURCH: "Kerkbeheer"
            },
            group_descriptions: {
              USER: "Beheer gebruikersaanmaak, bewerking en toegangsbeheer",
              ROLE: "Beheer systeemrollen en roltoewijzingen",
              PERMISSION: "Configureer systeembrede machtiginginstellingen",
              INSTITUTION: "Beheer instellingen en organisatiestructuur",
              REGION: "Beheer regionale afdelingen en gebieden",
              CHURCH: "Toezicht op kerkactiviteiten en -beheer"
            }
          }
        },
        permissions: {
          title: "Systeemmachtigingen",
          subtitle: "Bekijk alle beschikbare systeemmachtigingen",
          table: {
            name: "Machtigingsnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            group: "Groep"
          }
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            name: "Volledige Naam",
            email: "E-mailadres",
            institution: "Instelling",
            church: "Kerk",
            language: "Taalvoorkeur",
            roles: "Rollen Toewijzen",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          create_role: {
            title: "Nieuwe Rol Aanmaken",
            description: "Maak een nieuwe rol met specifieke machtigingen voor systeemtoegang",
            name: "Rolnaam",
            name_placeholder: "Voer rolnaam in (bijv. Manager, Editor)",
            key_code: "Sleutelcode",
            key_code_placeholder: "Voer unieke sleutel in (bijv. MANAGER)",
            description_label: "Beschrijving",
            description_placeholder: "Beschrijf wat deze rol kan doen...",
            permissions_note: "U kunt machtigingen toewijzen na het aanmaken van de rol",
            create: "Rol Aanmaken"
          },
          edit_role: {
            title: "Rol Bewerken",
            description: "Wijzig roldetails en beheer machtigingen",
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description_label: "Beschrijving",
            permissions: "Machtigingen",
            admin_key_locked: "Admin sleutelcode kan niet worden gewijzigd om veiligheidsredenen",
            edit_permissions: "Machtigingen Bewerken",
            save: "Wijzigingen Opslaan",
            cancel: "Annuleren"
          },
          delete_role: {
            title: "Rol Verwijderen",
            description: "Deze actie kan niet ongedaan worden gemaakt. De rol wordt permanent verwijderd.",
            reassign_description: "Deze rol is toegewezen aan gebruikers. U moet ze eerst opnieuw toewijzen.",
            reassign_to: "Gebruikers opnieuw toewijzen aan",
            select_role: "Selecteer een vervangende rol",
            reassign_warning: "Belangrijk: Gebruikersmachtigingen zullen veranderen",
            reassign_note: "Gebruikers erven onmiddellijk de machtigingen van de nieuwe rol",
            confirm_warning: "Weet u het absoluut zeker?",
            confirm_note: "Deze rol en al zijn associaties worden permanent verwijderd",
            skip_reassign: "Verwijderen Zonder Hertoewijzing",
            reassign_and_delete: "Hertoewijzen & Rol Verwijderen",
            delete: "Rol Verwijderen"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          role_created: "Rol succesvol aangemaakt",
          role_updated: "Rol succesvol bijgewerkt",
          role_deleted: "Rol succesvol verwijderd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          permissions_updated: "Machtigingen succesvol bijgewerkt",
          access_denied: "Toegang geweigerd - onvoldoende machtigingen",
          creating_role: "Rol aanmaken...",
          updating_role: "Rol bijwerken...",
          deleting_role: "Rol verwijderen...",
          role_create_failed: "Kon rol niet aanmaken",
          role_update_failed: "Kon rol niet bijwerken",
          role_delete_failed: "Kon rol niet verwijderen"
        }
      },
      users: {
        title: "Gebruikersbeheer",
        subtitle: "Beheer systeemgebruikers, rollen en machtigingen",
        overview: "Gebruikersoverzicht",
        kpis: {
          total_users: "Totaal Gebruikers",
          active_users: "Actieve Gebruikers",
          inactive_users: "Inactieve Gebruikers",
          new_users_month: "Nieuw Deze Maand",
          deleted_users: "Verwijderde Gebruikers",
          total_users_description: "Alle geregistreerde gebruikers",
          of_total: "van totaal",
          new_users_month_description: "Recent toegetreden",
          deleted_users_description: "Soft verwijderde gebruikers"
        },
        charts: {
          users_by_role: "Gebruikers per Rol",
          users_by_role_description: "Rolverdeling over gebruikers",
          users_by_institution: "Gebruikers per Instelling",
          users_by_institution_description: "Gebruikersaantal per instelling",
          user_growth: "Gebruikersgroei",
          user_growth_description: "Maandelijkse gebruikersregistratie trend",
          users_by_region: "Gebruikers per Regio",
          users_by_region_description: "Regionale gebruikersverdeling",
          users_by_department: "Gebruikers per Afdeling",
          users_by_department_description: "Afdelingsgebruikerstoewijzing"
        },
        table: {
          title: "Alle Gebruikers",
          description: "Beheer en bekijk alle systeemgebruikers",
          total_found: "gebruikers gevonden",
          avatar: "Avatar",
          name: "Naam",
          email: "E-mail",
          language: "Taal",
          institution: "Instelling",
          church: "Kerk",
          department: "Afdeling",
          roles: "Rollen",
          status: "Status",
          actions: "Acties",
          search_placeholder: "Zoek gebruikers...",
          no_results: "Geen gebruikers gevonden",
          active: "Actief",
          inactive: "Inactief"
        },
        actions: {
          create_user: "Gebruiker Aanmaken",
          edit_user: "Gebruiker Bewerken",
          delete_user: "Gebruiker Verwijderen",
          view_details: "Details Bekijken",
          assign_roles: "Rollen Toewijzen",
          activate_user: "Gebruiker Activeren",
          deactivate_user: "Gebruiker Deactiveren"
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            description: "Voeg een nieuwe gebruiker toe aan het systeem",
            name: "Volledige Naam",
            name_placeholder: "Voer de volledige naam in",
            email: "E-mailadres",
            email_placeholder: "Voer e-mailadres in",
            language: "Taalvoorkeur",
            institution: "Instelling",
            church: "Kerk",
            region: "Regio",
            department: "Afdeling (Optioneel)",
            roles: "Rollen Toewijzen",
            status: "Gebruikersstatus",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          edit_user: {
            title: "Gebruiker Bewerken",
            description: "Wijzig gebruikersinformatie en instellingen",
            save: "Wijzigingen Opslaan"
          },
          delete_user: {
            title: "Gebruiker Verwijderen",
            description: "Deze actie kan niet ongedaan worden gemaakt. De gebruiker wordt soft verwijderd.",
            confirm_warning: "Weet u zeker dat u deze gebruiker wilt verwijderen?",
            confirm_note: "De gebruiker wordt gedeactiveerd en gemarkeerd als verwijderd",
            delete: "Gebruiker Verwijderen",
            deactivate_title: "Gebruikerstoegang Deactiveren",
            deactivate_description: "Deze actie zal de toegang van de gebruiker tot het systeem verwijderen terwijl alle gegevens behouden blijven",
            view_consequences: "Consequenties Bekijken",
            understand_consequences: "Ik begrijp de consequenties",
            acknowledge_text: "Ik erken dat deze gebruiker toegang tot het systeem en alle bijbehorende privileges zal verliezen",
            type_confirmation: "Typ \"DELETE USER\" om deze actie te bevestigen:",
            confirmation_placeholder: "DELETE USER",
            confirmation_help: "Deze bevestiging zorgt ervoor dat u begrijpt welke actie wordt uitgevoerd",
            deactivate_user: "Gebruiker Deactiveren",
            deactivating: "Deactiveren...",
            consequences: {
              login_access: "Inlogtoegang Ingetrokken",
              login_access_desc: "Gebruiker kan niet meer authenticeren of toegang krijgen tot het systeem",
              data_preservation: "Gegevensbehoud", 
              data_preservation_desc: "Alle historische records, subsidies en rapporten worden bewaard",
              role_assignments: "Roltoewijzingen",
              role_assignments_desc: "Alle roltoewijzingen worden opgeschort maar kunnen worden hersteld"
            },
            soft_delete: {
              title: "Soft Delete Operatie",
              description: "Dit is een omkeerbare operatie. Het gebruikersaccount wordt gemarkeerd als inactief, waardoor systeemtoegang wordt voorkomen terwijl alle gegevensintegriteit behouden blijft. Het account kan op elk moment door een beheerder worden gereactiveerd."
            }
          },
          user_details: {
            title: "Gebruikersdetails",
            description: "Volledige gebruikersinformatie en geschiedenis",
            basic_info: "Basisinformatie",
            contact_info: "Contactinformatie",
            system_info: "Systeeminformatie",
            roles_permissions: "Rollen & Machtigingen",
            history: "Geschiedenis"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          user_activated: "Gebruiker succesvol geactiveerd",
          user_deactivated: "Gebruiker succesvol gedeactiveerd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          creating_user: "Gebruiker aanmaken...",
          updating_user: "Gebruiker bijwerken...",
          deleting_user: "Gebruiker verwijderen...",
          user_create_failed: "Kon gebruiker niet aanmaken",
          user_update_failed: "Kon gebruiker niet bijwerken",
          user_delete_failed: "Kon gebruiker niet verwijderen"
        },
        profile: {
          title: "Gebruikersprofiel",
          subtitle: "Volledige gebruikersinformatie en activiteitsoverzicht",
          analytics: {
            title: "Activiteitsanalyse",
            subtitle: "Volg gebruikersactiviteitstrends over tijd",
            subsidy_trends: "Subsidieaanvraag Trends",
            subsidy_description: "Maandelijkse subsidieaanvraagactiviteit",
            event_trends: "Evenementdeelname Trends", 
            event_description: "Maandelijkse evenementregistratie en aanwezigheid",
            report_trends: "Rapportindiening Trends",
            report_description: "Kwartaal- en jaarrapportindieningen",
            communication_trends: "Communicatieactiviteit Trends",
            communication_description: "Maandelijkse communicatiepatronen"
          },
          sections: {
            personal_info: "Persoonlijke Informatie",
            system_access: "Systeemtoegang",
            quick_actions: "Snelle Acties",
            recent_activity: "Recente Activiteit",
            organizational_context: "Organisatorische Context"
          },
          stats: {
            subsidies: "Subsidies",
            events: "Evenementen", 
            communications: "Communicaties",
            reports: "Rapporten",
            total_requests: "Totaal Aanvragen",
            approved: "Goedgekeurd",
            registered: "Geregistreerd",
            upcoming: "Komend",
            total: "Totaal",
            authored: "Geschreven",
            annual_reports: "Jaarrapporten",
            department: "Afdeling"
          },
          actions: {
            send_message: "Bericht Versturen",
            view_subsidies: "Subsidies Bekijken",
            view_events: "Evenementen Bekijken", 
            view_communications: "Communicaties Bekijken",
            view_reports: "Rapporten Bekijken",
            view_contact: "Contact Bekijken",
            edit_user: "Gebruiker Bewerken",
            delete_user: "Gebruiker Verwijderen",
            back_to_users: "Terug naar Gebruikers"
          },
          tabs: {
            subsidies: "Subsidies",
            events: "Evenementen",
            reports: "Rapporten",
            communications: "Communicaties"
          },
          tables: {
            recent_subsidies: "Recente Subsidieaanvragen",
            recent_events: "Recente Evenementregistraties",
            recent_reports: "Recente Rapportindieningen", 
            recent_communications: "Recente Communicaties",
            description: "Beschrijving",
            amount: "Bedrag",
            status: "Status",
            date: "Datum",
            event: "Evenement",
            type: "Type",
            title: "Titel",
            priority: "Prioriteit",
            report_id: "Rapport ID",
            department: "Afdeling",
            no_data: "Geen gegevens gevonden"
          },
          contact: {
            title: "Contactinformatie",
            description: "Contactgegevens voor",
            primary_contact: "Primair Contact",
            address: "Adres",
            primary_email: "Primair E-mail",
            primary_phone: "Primaire Telefoon",
            mobile: "Mobiel",
            website: "Website",
            notes: "Notities",
            close: "Sluiten"
          },
          message: {
            title: "Direct Bericht Versturen",
            description: "Verstuur een direct bericht naar",
            subject: "Onderwerp",
            message: "Bericht",
            subject_placeholder: "Berichtonderwerp...",
            message_placeholder: "Typ je bericht...",
            cancel: "Annuleren",
            send: "Bericht Versturen"
          },
          annual_report: {
            title: "Jaarlijks Subsidierapport",
            description: "Uitgebreid overzicht van subsidieaanvragen en gebruik",
            total_requested: "Totaal Aangevraagd",
            approved_amount: "Goedgekeurd Bedrag", 
            utilization_rate: "Gebruikspercentage",
            pending_requests: "Hangende Aanvragen"
          }
        },
        chat: {
          no_messages_title: "Nog geen berichten",
          no_messages_description: "Begin een gesprek met {name} door hieronder een bericht te sturen",
          quick_templates: "Snelle berichtsjablonen",
          message_placeholder: "Typ hier je bericht...",
          send_hint: "Druk op Ctrl+Enter om te verzenden",
          sending_message: "Bericht versturen...",
          message_sent: "Bericht succesvol verzonden",
          send_failed: "Kon bericht niet verzenden",
          errors: {
            empty_message: "Voer een bericht in",
            file_too_large: "Bestand is te groot. Maximale grootte is 10MB"
          },
          templates: {
            meeting_request: "Vergaderverzoek",
            subsidy_follow_up: "Subsidie Opvolging", 
            event_invitation: "Evenementuitnodiging",
            document_request: "Documentverzoek"
          },
          attachments: "Bijlagen",
          drop_files: "Sleep bestanden om bij te voegen",
          status: {
            sent: "Verzonden",
            delivered: "Afgeleverd",
            read: "Gelezen",
            online: "Online",
            offline: "Offline"
          }
        },

        // Contact modal translations
        contacts: {
          modal: {
            title: "Contact Information",
            for_entity: "Contact details for {{entity}}"
          },
          primary: "Primary Contact",
          secondary: "Secondary Contact",
          created_at: "Created {{date}}",
          empty_field: "Not provided",
          saving: "Saving...",
          sections: {
            basic_info: "Basic Information",
            address: "Address Information",
            additional: "Additional Information"
          },
          fields: {
            name: "Contact Name",
            email: "Email Address",
            phone: "Phone Number",
            mobile: "Mobile Number",
            website: "Website",
            country: "Country",
            city: "City",
            address: "Street Address",
            full_address: "Full Address",
            postal_code: "Postal Code",
            notes: "Notes",
            is_primary: "Primary Contact"
          },
          placeholders: {
            name: "Enter contact name",
            email: "Enter email address",
            phone: "Enter phone number",
            mobile: "Enter mobile number",
            website: "https://example.com",
            country: "Enter country",
            city: "Enter city",
            address: "Enter street address",
            full_address: "Enter complete address",
            postal_code: "Enter postal code",
            notes: "Additional notes or comments..."
          },
          toasts: {
            updating: "Updating contact information...",
            updated: "Contact information updated successfully",
            update_failed: "Failed to update contact information"
          }
        },

      }
    }
  }
}

// Initialize i18n
const initializeI18n = async () => {
  if (!i18n.isInitialized) {
    try {
      await i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // idioma padrão
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
          },
          react: {
            useSuspense: false
          },
          debug: false
        })
    } catch (error) {
      console.error('Failed to initialize i18n:', error)
    }
  }
}

// Initialize immediately
initializeI18n()

export default i18n
