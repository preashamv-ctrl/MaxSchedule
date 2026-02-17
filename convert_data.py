import pandas as pd
import json
import re
from datetime import datetime

def parse_date_range(date_str, year=2026):
    """
    Parses date strings like 'Feb 27–Mar 1' or 'Mar 7–8' into start and end date objects.
    Assumes the year is 2026.
    """
    if not isinstance(date_str, str):
        return None, None

    # Handle "Mid-Month" case
    if "mid-" in date_str.lower():
        try:
            month_str = date_str.lower().replace("mid-", "").strip().title()
            dt = datetime.strptime(f"{month_str} 15 {year}", "%B %d %Y")
            return dt.strftime("%Y-%m-%d"), dt.strftime("%Y-%m-%d")
        except ValueError:
            pass

    # Normalize separators (en-dash, em-dash to hyphen)
    date_str = date_str.replace('–', '-').replace('—', '-').strip()
    
    # Split by hyphen
    parts = date_str.split('-')
    if len(parts) != 2:
        return None, None
        
    start_part = parts[0].strip()
    end_part = parts[1].strip()
    
    # helper for parsing "Month Day"
    def parse_part(part, default_month=None):
        try:
            # Try "Month Day" format
            dt = datetime.strptime(f"{part} {year}", "%b %d %Y")
            return dt
        except ValueError:
            # Try just "Day" format, using default_month
            if default_month:
                try:
                    dt = datetime.strptime(f"{default_month} {part} {year}", "%b %d %Y")
                    return dt
                except ValueError:
                    pass
            return None

    start_dt = parse_part(start_part)
    if not start_dt:
        print(f"Failed to parse start date: {start_part}")
        return None, None
        
    # For end date, if it doesn't have a month, use start date's month
    end_dt = parse_part(end_part)
    if not end_dt:
        # Try with start month
        end_dt = parse_part(end_part, default_month=start_dt.strftime("%b"))
        
    if not end_dt:
        print(f"Failed to parse end date: {end_part}")
        return None, None
        
    return start_dt.strftime("%Y-%m-%d"), end_dt.strftime("%Y-%m-%d")

def convert_excel_to_json(excel_path, output_path):
    df = pd.read_excel(excel_path)
    
    events = []
    category_columns = [col for col in df.columns if col != 'Dates']
    
    event_id_counter = 1
    
    for index, row in df.iterrows():
        date_str = row['Dates']
        if pd.isna(date_str):
            continue
            
        start_date, end_date = parse_date_range(date_str)
        if not start_date:
            continue
            
        for category in category_columns:
            event_name = row[category]
            if pd.notna(event_name):
                # Clean up event name
                event_name = str(event_name).strip()
                if event_name.lower() == 'nan':
                    continue
                    
                events.append({
                    "id": f"evt_{event_id_counter}",
                    "title": event_name,
                    "start": start_date,
                    "end": end_date,
                    "category": category,
                    "location": event_name # using title as location for now as requested
                })
                event_id_counter += 1
                
    with open(output_path, 'w') as f:
        json_str = json.dumps(events, indent=2)
        f.write(f"const initialData = {json_str};")
        
    print(f"Successfully converted {len(events)} events to {output_path}")

if __name__ == "__main__":
    convert_excel_to_json('2026_Master_Schedule_Side_by_Side.xlsx', 'data.js')
