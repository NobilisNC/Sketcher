<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Sketch
 *
 * @ORM\Table(name="sketch")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SketchRepository")
 * @UniqueEntity(fields="name", message="sketch.title.unique")
 */
class Sketch
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="path", type="string", length=255, unique=true)
	 *
     */
    private $path;

    /**
    *
    * @ORM\ManyToMany(targetEntity="User", inversedBy="sketches")
    * @ORM\JoinColumn(name="user", referencedColumnName="id")
    *
    */
    private $authors;

    /**
    *
    * @ORM\ManyToMany(targetEntity="Tag", mappedBy="sketches")
    * @ORM\JoinColumn(name="tag", referencedColumnName="id")
    *
    */
    private $tags;


    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_upload", type="date")
     */
    private $dateUpload;

    /**
    *
    * @ORM\ManyToMany(targetEntity="User", mappedBy="liked_sketches")
    * @ORM\JoinColumn(name="user", referencedColumnName="id")
    *
    */
    private $likers;

	/**
	* @ORM\Column(name="width", type="integer", options={"default": 1000})
	* @Assert\Range(
	*   min=0,
	*   max=1000,
	*   minMessage="dimension.min.limit.reached",
	*   maxMessage="dimension.max.limit.reached"
	* )
	*/
	private $width;

	/**
	* @ORM\Column(name="height", type="integer", options={"default": 800})
	* @Assert\Range(
	*   min=0,
	*   max=1000,
	*   minMessage="dimension.min.limit.reached",
	*   maxMessage="dimension.max.limit.reached"
	* )
	*/
	private $height;

	/**
	* @ORM\Column(name="data", type="string", length=13370, options={"default": "{}"})
	*/
	private $data;

	/**
	* @ORM\OneToMany(targetEntity="User", mappedBy="editedSketch")
	*/
	private $editingUsers;


    public function __construct() {
		$this->name = '';
		$this->path = md5(uniqid('', true)).'.jpg';
        $this->dateUpload = new \DateTime();
        $this->authors = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->editingUsers = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Sketch
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set path
     *
     * @param string $path
     *
     * @return Sketch
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Get path
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set dateUpload
     *
     * @param \DateTime $dateUpload
     *
     * @return Sketch
     */
    public function setDateUpload($dateUpload)
    {
        $this->dateUpload = $dateUpload;

        return $this;
    }

    /**
     * Get dateUpload
     *
     * @return \DateTime
     */
    public function getDateUpload()
    {
        return $this->dateUpload;
    }

    /**
     * Add author
     *
     * @param \AppBundle\Entity\User $author
     *
     * @return Sketch
     */
    public function addAuthor(\AppBundle\Entity\User $author)
    {
        $this->authors[] = $author;

        return $this;
    }

    /**
     * Remove author
     *
     * @param \AppBundle\Entity\User $author
     */
    public function removeAuthor(\AppBundle\Entity\User $author)
    {
        $this->authors->removeElement($author);
    }

    /**
     * Get authors
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAuthors()
    {
        return $this->authors;
    }

    /**
     * Add tag
     *
     * @param \AppBundle\Entity\Tag $tag
     *
     * @return Sketch
     */
    public function addTag(\AppBundle\Entity\Tag $tag)
    {
        //$this->tags[] = $tag;
        $tag->addSketch($this);

        return $this;
    }

    /**
     * Remove tag
     *
     * @param \AppBundle\Entity\Tag $tag
     */
    public function removeTag(\AppBundle\Entity\Tag $tag)
    {
        //$this->tags->removeElement($tag);
        $tag->removeSketch($this);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Add liker
     *
     * @param \AppBundle\Entity\User $liker
     *
     * @return Sketch
     */
    public function addLiker(\AppBundle\Entity\User $liker)
    {
        $this->likers->add($liker);

        return $this;
    }

    /**
     * Remove liker
     *
     * @param \AppBundle\Entity\User $liker
     */
    public function removeLiker(\AppBundle\Entity\User $liker)
    {
        $this->likers->removeElement($liker);
    }

    /**
     * Get likers
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getLikers()
    {
        return $this->likers;
    }

    /**
     * Set data
     *
     * @param string $data
     *
     * @return Sketch
     */
    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    /**
     * Get data
     *
     * @return string
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set width
     *
     * @param integer $width
     *
     * @return Sketch
     */
    public function setWidth($width)
    {
        $this->width = $width;

        return $this;
    }

    /**
     * Get width
     *
     * @return integer
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set height
     *
     * @param integer $height
     *
     * @return Sketch
     */
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Get height
     *
     * @return integer
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * Get height
     *
     * @return integer
     */
     public function getLikes() {
         return $this->likers->count();
     }


    /**
     * Add editingUser
     *
     * @param \AppBundle\Entity\User $editingUser
     *
     * @return Sketch
     */
    public function addEditingUser(\AppBundle\Entity\User $editingUser)
    {
        $this->editingUsers[] = $editingUser;
		$editingUser->setEditedSketch($this);

        return $this;
    }

    /**
     * Remove editingUser
     *
     * @param \AppBundle\Entity\User $editingUser
     */
    public function removeEditingUser(\AppBundle\Entity\User $editingUser)
    {
        $this->editingUsers->removeElement($editingUser);
		$editingUser->setEditedSketch(null);
    }

    /**
     * Get editingUsers
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getEditingUsers()
    {
        return $this->editingUsers;
    }
}
