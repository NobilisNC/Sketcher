<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Sketch
 *
 * @ORM\Table(name="sketch")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SketchRepository")
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
	 * @Assert\File(mimeTypes={ "image/jpeg" })
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
    * @ORM\ManyToMany(targetEntity="User", mappedBy="sketches_liked")
    * @ORM\JoinColumn(name="user", referencedColumnName="id")
    *
    */
    private $likers;


    public function __construct() {
		$this->name = "";
		$this->path = "";
        $this->dateUpload = new \DateTime();
        $this->authors = new ArrayCollection();
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
        $this->tags[] = $tag;

        return $this;
    }

    /**
     * Remove tag
     *
     * @param \AppBundle\Entity\Tag $tag
     */
    public function removeTag(\AppBundle\Entity\Tag $tag)
    {
        $this->tags->removeElement($tag);
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
        $this->likers[] = $liker;

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
}
