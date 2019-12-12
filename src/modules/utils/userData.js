class userData {
  constructor(
    location_id,
    rating,
    employee_id,
    name,
    image,
    skill_id,
    dropout_page,
    feedback,
    customer_info,
    is_standout,
  ) {
    this.location_id = location_id;
    this.rating = rating;
    this.employee_id = employee_id;
    this.name = name;
    this.image = image;
    this.skill_id = skill_id;
    this.dropout_page = dropout_page;
    this.feedback = feedback;
    this.customer_info = customer_info;
    this.is_standout = is_standout;
  }
}

export default userData;
