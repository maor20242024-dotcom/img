#!/usr/bin/env python3
import json
import os
import glob

def translate_fields(data):
    """ترجمة الحقول الفارغة في البيانات"""
    
    # ترجمة الحقول الأساسية إذا كانت فارغة
    if 'summary' in data and (not data['summary'].get('en') or not data['summary'].get('ar')):
        if not data['summary'].get('en'):
            data['summary']['en'] = f"{data['projectName']['en']} offers premium living experience with exceptional amenities and strategic location in {data['area']['en']}."
        if not data['summary'].get('ar'):
            data['summary']['ar'] = f"تقدم {data['projectName']['ar']} تجربة معيشية راقية مع وسائل راحة استثنائية وموقع استراتيجي في {data['area']['ar']}."
    
    # ترجمة heroCopy إذا كانت فارغة
    if 'heroCopy' in data:
        if not data['heroCopy'].get('en', {}).get('title'):
            data['heroCopy']['en'] = {
                'title': f"{data['projectName']['en']}: Premium Living Experience",
                'subtitle': f"Luxury Residences with Exceptional Amenities in {data['area']['en']}"
            }
        if not data['heroCopy'].get('ar', {}).get('title'):
            data['heroCopy']['ar'] = {
                'title': f"{data['projectName']['ar']}: تجربة معيشية راقية",
                'subtitle': f"مساكن فاخرة مع وسائل راحة استثنائية في {data['area']['ar']}"
            }
    
    # ترجمة insights إذا كانت فارغة
    if 'insights' in data and (not data['insights'].get('en') or not data['insights'].get('ar')):
        if not data['insights'].get('en'):
            data['insights']['en'] = f"{data['projectName']['en']} represents a premium investment opportunity in {data['city']['en']}, offering luxury living with strong potential for capital appreciation and rental returns in the strategic {data['area']['en']} location."
        if not data['insights'].get('ar'):
            data['insights']['ar'] = f"تمثل {data['projectName']['ar']} فرصة استثمارية متميزة في {data['city']['ar']}، حيث تقدم عيشًا فاخرًا مع إمكانات قوية لتقدير رأس المال والعوائد الإيجارية في الموقع الاستراتيجي في {data['area']['ar']}."
    
    # ترجمة amenities إذا كانت فارغة
    if 'amenities' in data:
        for amenity in data['amenities']:
            if not amenity['description'].get('ar') and amenity['name'].get('en'):
                # ترجمة وصف المرافق بناءً على الاسم الإنجليزي
                amenity_name = amenity['name']['en'].lower()
                if 'pool' in amenity_name:
                    amenity['description']['ar'] = "مسبح فاخر للاستجمام والترفيه مع إطلالات خلابة"
                    amenity['description']['en'] = "A luxurious swimming pool for recreation and entertainment with stunning views"
                elif 'gym' in amenity_name or 'fitness' in amenity_name:
                    amenity['description']['ar'] = "مركز لياقة بدنية مجهز بأحدث الأجهزة الرياضية"
                    amenity['description']['en'] = "A fitness center equipped with the latest sports equipment"
                elif 'play' in amenity_name or 'kids' in amenity_name:
                    amenity['description']['ar'] = "منطقة آمنة وممتعة للأطفال مزودة بألعاب ترفيهية وتعليمية"
                    amenity['description']['en'] = "A safe and fun area for children equipped with entertaining and educational games"
                elif 'spa' in amenity_name or 'wellness' in amenity_name:
                    amenity['description']['ar'] = "مركز صحي متكامل يوفر خدمات العافية والاسترخاء"
                    amenity['description']['en'] = "An integrated wellness center providing health and relaxation services"
                elif 'business' in amenity_name:
                    amenity['description']['ar'] = "مركز أعمال مجهز بأحدث التقنيات لخدمة احتياجات العمل"
                    amenity['description']['en'] = "A business center equipped with the latest technologies to serve work needs"
                else:
                    amenity['description']['ar'] = f"وسيلة راحة راقية توفر تجربة استثنائية للمقيمين"
                    amenity['description']['en'] = f"A premium amenity providing exceptional experience for residents"
    
    # ترجمة mapPointsOfInterest إذا كانت فارغة
    if 'mapPointsOfInterest' in data:
        # التحقق مما إذا كان mapPointsOfInterest هو قائمة أو قاموس
        if isinstance(data['mapPointsOfInterest'], list):
            for poi in data['mapPointsOfInterest']:
                if isinstance(poi, dict):
                    if 'category' in poi and isinstance(poi['category'], dict):
                        if not poi['category'].get('ar') and poi['category'].get('en'):
                            category_en = poi['category']['en'].lower()
                            if 'park' in category_en:
                                poi['category']['ar'] = 'حديقة'
                            elif 'mall' in category_en or 'shopping' in category_en:
                                poi['category']['ar'] = 'مركز تسوق'
                            elif 'airport' in category_en:
                                poi['category']['ar'] = 'مطار'
                            elif 'beach' in category_en:
                                poi['category']['ar'] = 'شاطئ'
                            elif 'station' in category_en:
                                poi['category']['ar'] = 'محطة'
                            elif 'club' in category_en:
                                poi['category']['ar'] = 'نادي'
                            elif 'landmark' in category_en:
                                poi['category']['ar'] = 'معلم'
                            else:
                                poi['category']['ar'] = 'معلم'
                    
                    if 'distance' in poi and isinstance(poi['distance'], dict):
                        if not poi['distance'].get('ar') and poi['distance'].get('en'):
                            distance_en = poi['distance']['en']
                            if 'minute' in distance_en:
                                minutes = ''.join(filter(str.isdigit, distance_en))
                                if minutes:
                                    poi['distance']['ar'] = f"{minutes} دقيقة" if minutes != '1' else "دقيقة واحدة"
                                else:
                                    poi['distance']['ar'] = "دقائق"
                            else:
                                poi['distance']['ar'] = "غير متوفر"
                    
                    if 'name' in poi and isinstance(poi['name'], dict):
                        if not poi['name'].get('ar') and poi['name'].get('en'):
                            name_en = poi['name']['en']
                            # ترجمة أسماء الأماكن الشائعة
                            translations = {
                                'Downtown Dubai': 'وسط مدينة دبي',
                                'Dubai International Airport': 'مطار دبي الدولي',
                                'Palm Jumeirah': 'نخلة جميرا',
                                'Burj Khalifa': 'برج خليفة',
                                'Dubai Marina': 'دبي مارينا',
                                'Jumeirah Beach': 'شاطئ جميرا',
                                'Al Maktoum Airport': 'مطار آل مكتوم',
                                'Dubai Mall': 'دبي مول',
                                'Mall of the Emirates': 'مول الإمارات',
                                'Business Bay': 'الخليج التجاري'
                            }
                            poi['name']['ar'] = translations.get(name_en, name_en)
    
    # ترجمة propertyTypes إذا كانت فارغة
    if 'propertyTypes' in data:
        for prop_type in data['propertyTypes']:
            if not prop_type.get('ar') and prop_type.get('en'):
                type_en = prop_type['en'].lower()
                if 'apartment' in type_en:
                    prop_type['ar'] = 'شقة'
                elif 'villa' in type_en:
                    prop_type['ar'] = 'فيلا'
                elif 'townhouse' in type_en:
                    prop_type['ar'] = 'تاون هاوس'
                elif 'penthouse' in type_en:
                    prop_type['ar'] = 'بنتهاوس'
                elif 'duplex' in type_en:
                    prop_type['ar'] = 'دوبلكس'
                else:
                    prop_type['ar'] = prop_type['en']
    
    return data

def process_directory(directory):
    """معالجة جميع ملفات JSON في المجلد"""
    pattern = os.path.join(directory, "*.json")
    files = glob.glob(pattern)
    
    print(f"Processing {len(files)} files in {directory}")
    
    for file_path in files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # ترجمة الحقول الفارغة
            data = translate_fields(data)
            
            # حفظ الملف المحدث
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Updated: {os.path.basename(file_path)}")
            
        except Exception as e:
            print(f"✗ Error processing {file_path}: {str(e)}")

def main():
    """الدالة الرئيسية"""
    directories = [
        "public/data/damas",
        "public/data/emaar", 
        "public/data/nakheel",
        "public/data/sobha"
    ]
    
    for directory in directories:
        if os.path.exists(directory):
            process_directory(directory)
        else:
            print(f"Directory not found: {directory}")
    
    print("\nTranslation completed!")

if __name__ == "__main__":
    main()
